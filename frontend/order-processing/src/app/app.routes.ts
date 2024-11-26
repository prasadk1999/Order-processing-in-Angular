import { Routes } from '@angular/router';
import { CreateOrderComponent } from './create-order/create-order.component';
import { OrdersPageComponent } from './orders-page/orders-page.component';

export const routes: Routes = [
    {path: '', component: OrdersPageComponent},
    {path: 'create-order', component: CreateOrderComponent},
    {path: 'update-order/:orderId', component: CreateOrderComponent}
];
