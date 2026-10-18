export type Product = {
  id: number;
  name: string;
  description: string;
  nameEn?: string | null;
  nameAz?: string | null;
  descriptionEn?: string | null;
  descriptionAz?: string | null;
  price: number;
  imageUrl: string;
  category: string;
};

export interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  description?: string;
  nameEn?: string | null;
  nameAz?: string | null;
  descriptionEn?: string | null;
  descriptionAz?: string | null;
  price: number;
  imageUrl: string;
}
