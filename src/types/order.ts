export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface Order {
  id: number;
  userId: string;
  orderDate: string;
  products: Product[];
  totalPrice: number;
  status: string;
}
