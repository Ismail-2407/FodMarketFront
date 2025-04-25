import { useEffect, useState } from "react";
import { Product } from "../types/Product";
import styles from "./AdminProductsPage.module.css";

const API_URL = "http://localhost:5091";

function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Ошибка при загрузке продуктов", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить товар?")) return;
    try {
      await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Ошибка при удалении продукта", err);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Управление товарами</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price} ₽</td>
                <td>
                  <button
                    className={styles.delete}
                    onClick={() => handleDelete(p.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProductsPage;
