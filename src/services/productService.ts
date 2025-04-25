import { api } from "./api";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export const getProducts = async () => {
  const response = await api.get<Product[]>("/products");
  return response.data;
};
