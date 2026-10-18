import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Product } from "../types";
import { getProductName, translateCategory } from "../i18n/categories";
import styles from "./AdminProductsPage.module.css";

const API_URL = "http://localhost:5091";

function AdminProductsPage() {
  const { t, i18n } = useTranslation();
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
    if (!confirm(t("admin.confirmDeleteProduct"))) return;
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
      <h1>{t("admin.manageProducts")}</h1>

      {loading ? (
        <p>{t("admin.loading")}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("admin.productName")}</th>
              <th>{t("admin.category")}</th>
              <th>{t("admin.productPrice")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{getProductName(p, i18n.language)}</td>
                <td>{translateCategory(p.category, t)}</td>
                <td>{new Intl.NumberFormat(i18n.language).format(p.price)} ₽</td>
                <td>
                  <button
                    className={styles.delete}
                    onClick={() => handleDelete(p.id)}
                  >
                    {t("admin.delete")}
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
