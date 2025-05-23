// src/pages/OrdersPage.tsx
import React, { useEffect, useState } from "react";
import { fetchOrders, cancelOrder } from "../api/orders";
import { Order } from "../types/order";
import { useAuth } from "../context/AuthContext";

export const OrdersPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchOrders(token)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [token]);

  const handleCancel = async (id: number) => {
    if (!token) return;
    await cancelOrder(token, id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o))
    );
  };

  if (loading) return <p>Загрузка заказов...</p>;
  if (orders.length === 0) return <p>Заказы отсутствуют</p>;

  return (
    <div>
      <h1>Мои заказы</h1>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}
        >
          <p>
            <b>Номер заказа:</b> {order.id}
          </p>
          <p>
            <b>Дата:</b> {new Date(order.orderDate).toLocaleString()}
          </p>
          <p>
            <b>Статус:</b> {order.status}
          </p>
          <p>
            <b>Товары:</b>
          </p>
          <ul>
            {order.products.map((p) => (
              <li key={p.id}>
                {p.name} — {p.price} ₽
              </li>
            ))}
          </ul>
          <p>
            <b>Итого:</b> {order.totalPrice.toFixed(2)} ₽
          </p>
          {order.status === "Pending" && (
            <button onClick={() => handleCancel(order.id)}>
              Отменить заказ
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
