export type OrderStatus = 'OPEN' | 'CLOSED';

export interface Product {
  id: string;
  description: string; //maximo 50 caractereres
}

export interface Order {
  id: number;
  status: OrderStatus;
  products: Product[];
  createdAt: Date;
}