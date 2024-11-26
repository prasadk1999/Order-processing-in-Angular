import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { IOrders } from '../../models/orders.model';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertComponent } from "../utilities/alert/alert.component";

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [DatePipe, RouterLink, AlertComponent, NgClass],
  providers:[OrdersService],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css'
})
export class OrdersPageComponent implements OnInit {
  ordersList : IOrders[] = [];
  isOrderDeleted = false;
  operationMessage : string | null = null;
  lastCreatedOrderId : number | null = null;
  private ordersService = inject(OrdersService);
  private route = inject(ActivatedRoute);
  
  
  ngOnInit(): void {
    this.ordersService.getAllOrders()
                      .subscribe(
                        (ordersArr : IOrders[]) => 
                          this.ordersList = ordersArr.sort((a,b)=> +new Date(b.order_date.toString()) - +new Date(a.order_date.toString()))
                      );
    this.route.queryParams.subscribe((params) => {
      const orderId = Number(params['orderId']);
      this.lastCreatedOrderId = orderId;
    });
  }

  onDeleteBtnClicked(orderId: number) {
    this.ordersService.deleteOrder(orderId).subscribe((res : any)=>{
      alert(res.message);
      this.isOrderDeleted = true;
      this.operationMessage = `Order id ${orderId} is deleted successfully`;
      this.ordersList = this.ordersList.filter((value,index)=>{
        return value.order_id !==orderId;
      });

      setTimeout(()=>{
        this.isOrderDeleted = false;
        this.operationMessage = null;
      },3000)
    });
  }


}
