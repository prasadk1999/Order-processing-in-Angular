import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { OrdersPageComponent } from './orders-page/orders-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'order-processing';
}
