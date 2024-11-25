import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { IOrders } from '../../models/orders.model';
import { DatePipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [DatePipe, RouterLink],
  providers:[OrdersService],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css'
})
export class OrdersPageComponent implements OnInit {
  ordersList !: IOrders[];
  
  constructor(private ordersService : OrdersService){}
  
  
  ngOnInit(): void {
    this.ordersService.getAllOrders()
                      .subscribe(
                        (ordersArr : IOrders[]) => 
                          this.ordersList = ordersArr );
  }


}
