import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.services';
import { IProduct } from '../../models/product.model';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgFor, NgIf } from '@angular/common';
import { ICreateOrder } from '../../models/create-order.model';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  providers: [ProductsService],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit {
  productsList !: IProduct[];
  orderForm !: FormGroup;
  totalOrderAmount = 0;
  constructor(private productService: ProductsService, private orderService: OrdersService, private fb : FormBuilder){  }
  
  
  ngOnInit(): void {
    this.productService.getAllProducts()
    .subscribe((productsArr : IProduct[]) => this.productsList = productsArr);

    this.orderForm = this.fb.group({
      totalOrderAmount : 0,
      orders: this.fb.array([
        this.addNewProduct()
      ])
    });

  }
  
  get orders() { return this.orderForm.get('orders') as FormArray; }
  
  private addNewProduct(): FormGroup<{ productId: FormControl<number | null>; quantity: FormControl<number | null>;  totalPrice: FormControl<number | null> }> {
    const productRow =  this.fb.group({
      productId: [0, [Validators.required, this.invalidProductValidator()]],
      quantity: [1, Validators.min(1)],
      totalPrice: [0, Validators.min(0)]
    });

    this.setupValueChangeListeners(productRow);

    return productRow;
  }

  addProduct() {
    this.orders.push(this.addNewProduct());
  }

  removeProduct(_t11: any) {
    throw new Error('Method not implemented.');
  }

  setupValueChangeListeners(order: FormGroup): void { 
    order.get('productId')?.valueChanges
                            .subscribe(() => { 
                              this.computeTotalPrice(order); 
                              this.orderForm.get('totalOrderAmount')?.setValue(this.getTotalOrderPrice());
                            }); 
    order.get('quantity')?.valueChanges
                            .subscribe(() => { 
                              this.computeTotalPrice(order);
                              this.orderForm.get('totalOrderAmount')?.setValue(this.getTotalOrderPrice());
                            });
  }

  computeTotalPrice(order: FormGroup): void { 
    const productId = order.get('productId')?.value as number; 
    const quantity = order.get('quantity')?.value  as number; 
    // Here you can add your logic to compute the total price. 
    // For example, if productId corresponds to a specific price: 
    const pricePerUnit = this.productsList.find((value,index) => value.productId == productId)?.price ?? 0;
    const totalPrice = pricePerUnit * quantity; 
    order.get('totalPrice')?.setValue(totalPrice);
  }

  getTotalOrderPrice(): number { 
    return this.orders.controls.reduce((acc, order) => { 
      const totalPrice = order.get('totalPrice')?.value || 0; 
      return acc + totalPrice; }, 0
    ); 
  }

  invalidProductValidator(): ValidatorFn { 
    return (control: AbstractControl): ValidationErrors | null => { 
      return control.value === 0 ? { invalidProduct: true } : null; 
    }; 
  }

  onPlaceOrder() {
    console.log(this.orderForm.value.orders)
    const orderFormObj = this.orderForm.value.orders as ICreateOrder[];
    const orderObj = orderFormObj.map((value) : ICreateOrder => {
      return {
        productId : value.productId, 
        quantity: value.quantity
      }
    });
    
    console.log(orderObj);
    
    this.orderService.placeOrder(orderObj).subscribe(()=>{
      alert("Order created successfully")
    })
    
  }
}
