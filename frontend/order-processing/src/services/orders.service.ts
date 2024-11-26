import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrders } from '../models/orders.model';
import { ICreateOrder } from '../models/create-order.model';
import { IOrderInfo } from '../models/orders-info.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  getAllOrders(){
    return this.http.get<IOrders[]>('http://localhost:5290/api/v1/order/orders');
  }

  getOrderByOrderId(orderId : number){
    return this.http.get<IOrderInfo>(`http://localhost:5290/api/v1/order/order/${orderId}`);
  }

  placeOrder(createOrderObj : ICreateOrder[]){
    return this.http.post<ICreateOrder[]>('http://localhost:5290/api/v1/order/create',createOrderObj);
  }

  updateOrder(orderId : number, createOrderObj : ICreateOrder[]){
    return this.http.put<ICreateOrder[]>(`http://localhost:5290/api/v1/order/update/${orderId}`,createOrderObj);
  }

  deleteOrder(orderId : number){
    return this.http.delete(`http://localhost:5290/api/v1/order/delete/${orderId}`);
  }


}
