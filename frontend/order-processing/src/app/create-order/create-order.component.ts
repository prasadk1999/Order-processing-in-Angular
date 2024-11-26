import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.services';
import { IProduct } from '../../models/product.model';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgFor, NgIf } from '@angular/common';
import { ICreateOrder } from '../../models/create-order.model';
import { OrdersService } from '../../services/orders.service';
import { AlertComponent } from "../utilities/alert/alert.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, AlertComponent],
  providers: [ProductsService],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit {
  productsList !: IProduct[];
  orderForm !: FormGroup;
  totalOrderAmount = 0;
  isOrderPlaced = false;
  orderId : number | null = null;
  private productService = inject(ProductsService);
  private orderService = inject(OrdersService);
  private fb = inject(FormBuilder);
  private route = inject(Router);
  private activateRoute = inject(ActivatedRoute);
  
  ngOnInit(): void {
    this.productService.getAllProducts()
                        .subscribe((productsArr : IProduct[]) => this.productsList = productsArr);

    this.activateRoute.params.subscribe((params) => {
      const paramOrderId = Number(params['orderId']);
      console.log(paramOrderId);
      if(isNaN(paramOrderId)){
        this.orderId = null;
        this.orderForm = this.fb.group({
          totalOrderAmount : 0,
          orders: this.fb.array([
            this.addNewProduct()
          ])
        });
      }
      else{
        this.orderId = paramOrderId;
        this.orderForm = this.fb.group({
          totalOrderAmount : 0,
          orders: this.fb.array([ ])
        });
        this.orderService.getOrderByOrderId(this.orderId)
                          .subscribe((res)=>{
                            console.log(res);
                            for(const value of res.order_details){
                              this.orders.push(this.addNewProduct(value.product_id, value.quantity, value.amount));
                            }
                            
                            this.computeTotalOrderAmount();
                          })
      }

    });

  }
  
  get orders() { return this.orderForm.get('orders') as FormArray; }

  addProduct() {
    this.orders.push(this.addNewProduct());
  }

  removeProduct(prodIndex: number) {
    this.orders.removeAt(prodIndex);
    this.computeTotalOrderAmount();
  }

  onPlaceOrder() {
    const orderFormObj = this.orderForm.value.orders as ICreateOrder[];
    const orderObj = orderFormObj.map((value) : ICreateOrder => {
      return {
        productId : value.productId, 
        quantity: value.quantity
      }
    });

    let orderExecution;
    
    if(!this.orderId){
      orderExecution = this.orderService.placeOrder(orderObj);
    }
    else{
      orderExecution = this.orderService.updateOrder(this.orderId, orderObj);
    }

    orderExecution.subscribe((res : any)=>{
      this.isOrderPlaced = true;
      setTimeout(()=>{
        this.orderForm.reset();
        this.orderForm.setControl('orders', this.fb.array([this.addNewProduct()])); 
        this.route.navigate(["/"],{queryParams: {orderId : res.orderId}});
      },3000);
    })
    
  }

  // Private methods
  private addNewProduct(productId = 0, quantity = 1, totalPrice = 0): FormGroup<{ productId: FormControl<number | null>; quantity: FormControl<number | null>;  totalPrice: FormControl<number | null> }> {
    const productRow =  this.fb.group({
      productId: [productId, [Validators.required, this.invalidProductValidator()]],
      quantity: [quantity, Validators.min(1)],
      totalPrice: [totalPrice, Validators.min(0)]
    });

    this.setupValueChangeListeners(productRow);

    return productRow;
  }

  private setupValueChangeListeners(order: FormGroup): void { 
    order.get('productId')?.valueChanges
                            .subscribe(() => { 
                              this.computeTotalPrice(order); 
                              this.computeTotalOrderAmount();
                            }); 
    order.get('quantity')?.valueChanges
                            .subscribe(() => { 
                              this.computeTotalPrice(order);
                              this.computeTotalOrderAmount();
                            });
  }

  private computeTotalOrderAmount() {
    this.orderForm.get('totalOrderAmount')?.setValue(this.getTotalOrderPrice());
  }

  private computeTotalPrice(order: FormGroup): void { 
    const productId = order.get('productId')?.value as number; 
    const quantity = order.get('quantity')?.value  as number; 
    // Here you can add your logic to compute the total price. 
    // For example, if productId corresponds to a specific price: 
    const pricePerUnit = this.productsList.find((value,index) => value.productId == productId)?.price ?? 0;
    const totalPrice = pricePerUnit * quantity; 
    order.get('totalPrice')?.setValue(totalPrice);
  }

  private getTotalOrderPrice(): number { 
    return this.orders.controls.reduce((acc, order) => { 
      const totalPrice = order.get('totalPrice')?.value || 0; 
      return acc + totalPrice; }, 0
    ); 
  }

  private invalidProductValidator(): ValidatorFn { 
    return (control: AbstractControl): ValidationErrors | null => { 
      return control.value === 0 ? { invalidProduct: true } : null; 
    }; 
  }
}
