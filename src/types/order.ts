export interface Product {
  id: number;
  name: string;
  description?: string;
  nameEn?: string | null;
  nameAz?: string | null;
  descriptionEn?: string | null;
  descriptionAz?: string | null;
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
