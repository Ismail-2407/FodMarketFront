export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

export interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}
