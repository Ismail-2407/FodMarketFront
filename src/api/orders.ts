import axiosInstance from "./axiosInstance";
import { Order } from "../types/order";

const API_URL = "/orders";

export type PaymentMethod = "PayPal" | "Cash";

function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.$values)) return obj.$values as T[];
  }
  return [];
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await axiosInstance.get(API_URL);
    return asArray<Order>(res.data);
  } catch (error) {
    console.error("Error in fetchOrders:", error);
    throw error;
  }
}

export async function createOrder(
  productIds: number[],
  paymentMethod: PaymentMethod
) {
  const response = await axiosInstance.post(API_URL, {
    productIds,
    paymentMethod,
  });
  return response.data;
}

export async function cancelOrder(orderId: number) {
  await axiosInstance.delete(`${API_URL}/${orderId}`);
}
