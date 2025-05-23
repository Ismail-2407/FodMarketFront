export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}
