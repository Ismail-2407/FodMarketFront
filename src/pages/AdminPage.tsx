import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Product } from "../types";
import axiosInstance from "../api/axiosInstance";
import styles from "./AdminPage.module.css";

const AdminPage: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isAdmin) {
      fetchProducts();
    }
  }, [loading, isAdmin]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError("Ошибка загрузки товаров");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/admin/products/${id}`);
      fetchProducts();
      setError(null);
    } catch (err) {
      setError("Ошибка удаления товара");
      console.error(err);
    }
  };

  const handleAdd = async () => {
    try {
      await axiosInstance.post("/products", newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        category: "",
      });
      fetchProducts();
      setError(null);
    } catch (err) {
      setError("Ошибка добавления товара");
      console.error(err);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className={styles.adminContainer}>
      <h1>Админ-панель</h1>

      <button className={styles.navButton} onClick={() => navigate("/catalog")}>
        Перейти в каталог
      </button>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div className={styles.addProductForm}>
        <h2>Добавить товар</h2>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Название"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Описание"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Цена"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: Number(e.target.value) })
            }
          />
          <input
            type="text"
            placeholder="Ссылка на картинку"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageUrl: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Категория"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          />
          <button onClick={handleAdd}>Добавить</button>
        </div>
      </div>

      <h2>Товары</h2>
      <div className={styles.productsList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <img src={product.imageUrl} alt={product.name} />
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <p>{product.price} ₽</p>
              <button onClick={() => handleDelete(product.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
