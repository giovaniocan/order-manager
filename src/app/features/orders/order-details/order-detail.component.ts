import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  newProductDescription = '';
  loading = false;
  error = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrder(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loading = true;

    this.orderService.getOrderById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => {
          if (!order) {
            this.router.navigate(['/orders']);
            return;
          }
          this.order = order;
          this.loading = false;
        },
        error: () => this.router.navigate(['/orders']),
      });
  }

  addProduct(): void {
    if (!this.order) return;
    this.error = '';

    this.orderService.addProduct(this.order.id, this.newProductDescription)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedOrder) => {
          this.order = updatedOrder;
          this.newProductDescription = '';
        },
        error: (err) => (this.error = err.message),
      });
  }

  removeProduct(productId: string): void {
    if (!this.order) return;
    this.error = '';

    this.orderService.removeProduct(this.order.id, productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedOrder) => (this.order = updatedOrder),
        error: (err) => (this.error = err.message),
      });
  }

  closeOrder(): void {
    if (!this.order) return;
    this.error = '';

    this.orderService.closeOrder(this.order.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedOrder) => (this.order = updatedOrder),
        error: (err) => (this.error = err.message),
      });
  }

  get isClosed(): boolean {
    return this.order?.status === 'CLOSED';
  }

  get canClose(): boolean {
    return !this.isClosed && (this.order?.products.length ?? 0) > 0;
  }

  get descriptionLength(): number {
    return this.newProductDescription.length;
  }
}