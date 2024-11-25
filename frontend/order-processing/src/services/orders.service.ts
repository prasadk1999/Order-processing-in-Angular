import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrders } from '../models/orders.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  getAllOrders(){
    return this.http.get<IOrders[]>('http://localhost:5290/api/v1/order/orders');
    
  }


}
