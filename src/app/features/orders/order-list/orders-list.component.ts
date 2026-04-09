import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  // imports = os "imports" do componente. CommonModule traz *ngIf, *ngFor, pipes.
  // FormsModule traz [(ngModel)]. RouterLink traz o [routerLink].
  // É como os imports do React, mas declarados explicitamente no componente.
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders-list.component.html',
})
export class OrdersListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter: '' | OrderStatus = '';
  loading = false;
  error = '';


  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders()
      .pipe(takeUntil(this.destroy$)) 
      .subscribe({
        next: (orders) => {           
          this.orders = orders;
          this.applyFilter();
          this.loading = false;
        },
        error: (err) => {           
          this.error = err.message;
          this.loading = false;
        },
      });
  }

  applyFilter(): void {
    this.filteredOrders = this.statusFilter
      ? this.orders.filter(o => o.status === this.statusFilter)
      : [...this.orders];
  }

  createOrder(): void {
    this.orderService.createOrder()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => this.router.navigate(['/orders', order.id]),
        error: (err) => (this.error = err.message),
      });
  }
}