import { Routes } from '@angular/router';
import { OrdersListComponent } from './features/orders/order-list/orders-list.component';
import { OrderDetailComponent } from './features/orders/order-details/order-detail.component';

// Equivalente ao <Routes> do React Router
export const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', component: OrdersListComponent },
  { path: 'orders/:id', component: OrderDetailComponent },
];