import axios from "axios";
import { Order } from "../types/order";

const API_URL = "http://localhost:5091/api/orders";

export async function fetchOrders(token: string): Promise<Order[]> {
  const response = await axios.get<Order[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createOrder(token: string, productIds: number[]) {
  const response = await axios.post(
    API_URL,
    { productIds },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function cancelOrder(token: string, orderId: number) {
  await axios.delete(`${API_URL}/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
