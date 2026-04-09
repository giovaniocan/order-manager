import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError} from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order, Product } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private orders: Order[] = [];

  private ordersSubject = new BehaviorSubject<Order[]>([]);


  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable().pipe(
        delay(1000) // para simular uma chamada ao back ou uma api externa
    );
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return of(this.orders.find(order => order.id === id)).pipe(delay(300));
  }

  createOrder(): Observable<Order>{
    const order: Order = {
        id: crypto.randomUUID(),
        status: 'OPEN',
        products: [],
        createdAt: new Date()
    }
    this.orders.push(order);
    this.ordersSubject.next([...this.orders]);
    return of(order)
  }
  
  addProduct(orderId: string, description: string): Observable<Order> {
    const order = this.orders.find(o => o.id === orderId);

    if (!order){
        return throwError(() => new Error('Pedido não encontrado.'));
    }

    if (order.status === 'CLOSED') {
        return throwError(() => new Error('Não é possível adicionar produtos em um pedido fechado.'));
    }
        
    if (description.length > 50) {
        return throwError(() => new Error('A descrição do produto deve ter no máximo 50 caracteres.'));

    }

    if(!description.trim()) {
        return throwError(() => new Error('Descrição não pode ser vazia.'));
    }


    const product: Product = {
      id: crypto.randomUUID(),
      description: description.trim(),
    };

    order.products.push(product);
    this.ordersSubject.next([...this.orders]);

    return of({ ...order, products: [...order.products] });
  }

  removeProduct(orderId: string, productId: string): Observable<Order> {
    const order = this.orders.find(o => o.id === orderId);

    if (!order) {
        return throwError(() => new Error('Pedido não encontrado ou invalido.'));
    }
    if (order.status === 'CLOSED') {
        return throwError(() => new Error('Não é possível remover produtos de um pedido já fechado.'));
    }
        

    order.products = order.products.filter(p => p.id !== productId);
    this.ordersSubject.next([...this.orders]);

    return of({ ...order, products: [...order.products] });
  }

  closeOrder(orderId: string): Observable<Order> {
    const order = this.orders.find(o => o.id === orderId);

    if (!order) {
        return throwError(() => new Error('Pedido não encontrado ou invalido.'));
    }
    if (order.products.length === 0) {
        return throwError(() => new Error('O pedido precisa ter ao menos um produto para ser fechado.'));
    }

    order.status = 'CLOSED';
    this.ordersSubject.next([...this.orders]);

    return of({ ...order, products: [...order.products] });
  }

}