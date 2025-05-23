import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types";
import { createOrder } from "../api/orders";
import axiosInstance from "../api/axiosInstance";

function CartPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (!token) return;

    axiosInstance
      .get("/cart")
      .then((res) => {
        setProducts(res.data.products || []);
        const sum =
          res.data.products?.reduce(
            (acc: number, p: Product) => acc + p.price,
            0
          ) || 0;
        setTotal(sum);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      });
  }, [token]);

  const handleRemove = (productId: number) => {
    if (!token) return;

    axiosInstance
      .delete(`/cart/${productId}`)
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setTotal((prev) => {
          const removed = products.find((p) => p.id === productId);
          return removed ? prev - removed.price : prev;
        });
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
  };

  const handleClear = () => {
    if (!token) return;

    axiosInstance
      .delete("/cart")
      .then(() => {
        setProducts([]);
        setTotal(0);
      })
      .catch((error) => {
        console.error("Error clearing cart:", error);
      });
  };

  // Функция для подтверждения заказа (создания заказа на бэке)
  async function submitOrder() {
    if (!token) {
      alert("Пожалуйста, авторизуйтесь");
      return;
    }

    try {
      const productIds = products.map((p) => p.id);
      const newOrder = await createOrder(token, productIds);
      alert(`Заказ №${newOrder.id} успешно создан!`);
      // Очистить корзину после успешного создания заказа
      setProducts([]);
      setTotal(0);
    } catch {
      alert("Ошибка при создании заказа");
    }
  }

  return (
    <div>
      <h1>Корзина</h1>
      {products.length === 0 ? (
        <p>Ваша корзина пуста</p>
      ) : (
        <>
          <ul>
            {products.map((p) => (
              <li key={p.id}>
                {p.name} - {p.price} ₽
                <button onClick={() => handleRemove(p.id)}>Удалить</button>
              </li>
            ))}
          </ul>
          <p>Итого: {total.toFixed(2)} ₽</p>
          <button onClick={handleClear}>Очистить корзину</button>
          <button onClick={submitOrder}>Оформить заказ</button>
        </>
      )}
    </div>
  );
}

export default CartPage;
