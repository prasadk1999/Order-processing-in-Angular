import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrders } from '../models/orders.model';
import { ICreateOrder } from '../models/create-order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  getAllOrders(){
    return this.http.get<IOrders[]>('http://localhost:5290/api/v1/order/orders');
    
  }

  placeOrder(createOrderObj : ICreateOrder[]){
    return this.http.post<ICreateOrder[]>('http://localhost:5290/api/v1/order/create',createOrderObj);
  }

  deleteOrder(orderId : number){
    return this.http.delete(`http://localhost:5290/api/v1/order/delete/${orderId}`);
  }


}
