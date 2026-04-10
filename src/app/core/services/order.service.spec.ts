import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { firstValueFrom } from 'rxjs';
import { Order } from '../models/order.model';

describe('OrderService', () => {
    let service: OrderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OrderService);
    });

    // Helper para criar um pedido
    const createOrder = () => firstValueFrom(service.createOrder());

    it('should create an order with OPEN status and no products', async () => {
        const order = await createOrder();
        expect(order.status).toBe('OPEN');
        expect(order.products.length).toBe(0);
    });

    it('should add a product when description is valid and order is open', async () => {
        const order = await createOrder();
        const updated = await firstValueFrom(service.addProduct(order.id, 'New Product'));
        
        expect(updated.products.length).toBe(1);
        expect(updated.products[0].description).toBe('New Product');
    });

    it('should throw error when adding description longer than 50 characters', async () => {
        const order = await createOrder();
        const longDesc = 'a'.repeat(51);

        try {
        await firstValueFrom(service.addProduct(order.id, longDesc));
        fail('Should have thrown an error');
        } catch (err: any) {
        expect(err.message).toBe('A descrição do produto deve ter no máximo 50 caracteres.');
        }
    });

    it('should throw error when adding empty description', async () => {
        const order = await createOrder();
        
        try {
        await firstValueFrom(service.addProduct(order.id, '   '));
        fail('Should have thrown an error');
        } catch (err: any) {
        expect(err.message).toBe('Descrição não pode ser vazia.');
        }
    });

    it('should remove a product from an open order', async () => {
        const order = await createOrder();
        const withProduct = await firstValueFrom(service.addProduct(order.id, 'Item to Remove'));
        const productId = withProduct.products[0].id;

        const updated = await firstValueFrom(service.removeProduct(order.id, productId));
        expect(updated.products.length).toBe(0);
    });

    it('should not close an order without products', async () => {
        const order = await createOrder();
        
        try {
        await firstValueFrom(service.closeOrder(order.id));
        fail('Should not close empty order');
        } catch (err: any) {
        expect(err.message).toBe('O pedido precisa ter ao menos um produto para ser fechado.');
  
        expect(order.status).toBe('OPEN');
        }
    });

    it('should not close an order without products', async () => {
        const order = await createOrder();
        
        try {
        await firstValueFrom(service.closeOrder(order.id));
        fail('Should not close empty order');
        } catch (err: any) {
        expect(err.message).toBe('O pedido precisa ter ao menos um produto para ser fechado.');
  
        expect(order.status).toBe('OPEN');
        }
    });

    it('should emit updated list in getOrders after any change', async () => {
        await createOrder();
        await createOrder();
        
        const orders = await firstValueFrom(service.getOrders());
        expect(orders.length).toBe(2);
    });
    });


