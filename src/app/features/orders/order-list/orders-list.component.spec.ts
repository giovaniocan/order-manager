import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { OrdersListComponent } from './orders-list.component';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

const makeOrder = (id: string, status: 'OPEN' | 'CLOSED'): Order => ({
  id,
  status,
  products: status === 'CLOSED' ? [{ id: 'p1', description: 'Product' }] : [],
  createdAt: new Date(),
});

const mockOrders: Order[] = [
  makeOrder('1', 'OPEN'),
  makeOrder('2', 'CLOSED'),
];

describe('OrdersListComponent', () => {
  let fixture: ComponentFixture<OrdersListComponent>;
  let component: OrdersListComponent;

  const orderService = {
    getOrders: vi.fn(() => of(mockOrders)),
    createOrder: vi.fn(),
  };

  const router = { navigate: vi.fn() };

  const activatedRoute = {
    snapshot: { paramMap: { get: () => null } },
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    orderService.getOrders.mockReturnValue(of(mockOrders));

    await TestBed.configureTestingModule({
      imports: [OrdersListComponent],
      providers: [
        { provide: OrderService,   useValue: orderService },
        { provide: Router,         useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load and display all orders on init', () => {
    expect(component.filteredOrders.length).toBe(2);
  });

  it('should display only OPEN orders when filter is "OPEN"', () => {
    component.statusFilter = 'OPEN';
    component.applyFilter();

    expect(component.filteredOrders.length).toBe(1);
    expect(component.filteredOrders[0].status).toBe('OPEN');
  });

  it('should display only CLOSED orders when filter is "CLOSED"', () => {
    component.statusFilter = 'CLOSED';
    component.applyFilter();

    expect(component.filteredOrders.length).toBe(1);
    expect(component.filteredOrders[0].status).toBe('CLOSED');
  });

  it('should display all orders when filter is cleared', () => {
    component.statusFilter = 'OPEN';
    component.applyFilter();

    component.statusFilter = '';
    component.applyFilter();

    expect(component.filteredOrders.length).toBe(2);
  });

  it('should navigate to order detail after creating an order', () => {
    const newOrder = makeOrder('new-id', 'OPEN');
    orderService.createOrder.mockReturnValue(of(newOrder));

    component.createOrder();

    expect(router.navigate).toHaveBeenCalledWith(['/orders', 'new-id']);
  });
});