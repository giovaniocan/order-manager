import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDetailComponent } from './order-detail.component';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

const openOrder: Order = {
  id: 'abc123',
  status: 'OPEN',
  products: [{ id: 'p1', description: 'Test Product' }],
  createdAt: new Date(),
};

const closedOrder: Order = { ...openOrder, status: 'CLOSED' };
const emptyOrder: Order  = { ...openOrder, products: [] };

describe('OrderDetailComponent', () => {
  let fixture: ComponentFixture<OrderDetailComponent>;
  let component: OrderDetailComponent;

  const orderService = {
    getOrderById: vi.fn(),
    addProduct: vi.fn(),
    removeProduct: vi.fn(),
    closeOrder: vi.fn(),
  };

  const router = { navigate: vi.fn() };

  async function setup(order: Order): Promise<void> {
    vi.clearAllMocks();
    orderService.getOrderById.mockReturnValue(of(order));

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [OrderDetailComponent],
      providers: [
        { provide: OrderService, useValue: orderService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => order.id } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('canClose should be false when order has no products', async () => {
    await setup(emptyOrder);
    expect(component.canClose).toBe(false);
  });

  it('canClose should be true when open order has products', async () => {
    await setup(openOrder);
    expect(component.canClose).toBe(true);
  });

  it('canClose should be false when order is closed', async () => {
    await setup(closedOrder);
    expect(component.canClose).toBe(false);
  });

  it('isClosed should be true for a closed order', async () => {
    await setup(closedOrder);
    expect(component.isClosed).toBe(true);
  });

  it('addProduct() should update the order and clear the input field', async () => {
    await setup(openOrder);

    const updated: Order = {
      ...openOrder,
      products: [...openOrder.products, { id: 'p2', description: 'New Product' }],
    };
    orderService.addProduct.mockReturnValue(of(updated));

    component.newProductDescription = 'New Product';
    component.addProduct();

    expect(component.order?.products.length).toBe(2);
    expect(component.newProductDescription).toBe('');
  });

  it('addProduct() should set error message when service throws', async () => {
    await setup(openOrder);

    orderService.addProduct.mockReturnValue(
      throwError(() => new Error('A descrição do produto deve ter no máximo 50 caracteres.'))
    );

    component.newProductDescription = 'a'.repeat(51);
    component.addProduct();

    expect(component.error).toBe('A descrição do produto deve ter no máximo 50 caracteres.');
  });

  it('removeProduct() should remove the product from the order', async () => {
    await setup(openOrder);

    const updated: Order = { ...openOrder, products: [] };
    orderService.removeProduct.mockReturnValue(of(updated));

    component.removeProduct('p1');

    expect(component.order?.products.length).toBe(0);
  });

  it('closeOrder() should update order status to CLOSED', async () => {
    await setup(openOrder);

    orderService.closeOrder.mockReturnValue(of(closedOrder));
    component.closeOrder();

    expect(component.order?.status).toBe('CLOSED');
  });

  it('closeOrder() should set error message when service throws', async () => {
    await setup(emptyOrder);

    orderService.closeOrder.mockReturnValue(
      throwError(() => new Error('O pedido precisa ter ao menos um produto para ser fechado.'))
    );

    component.closeOrder();

    expect(component.error).toBe('O pedido precisa ter ao menos um produto para ser fechado.');
  });
});