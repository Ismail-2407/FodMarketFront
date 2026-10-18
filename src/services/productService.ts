import { api } from "./api";

export interface Product {
  id: number;
  name: string;
  description: string;
  nameEn?: string | null;
  nameAz?: string | null;
  descriptionEn?: string | null;
  descriptionAz?: string | null;
  price: number;
  imageUrl: string;
}

export const getProducts = async () => {
  const response = await api.get<Product[]>("/products");
  return response.data;
};
