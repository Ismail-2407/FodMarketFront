import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Product } from "../types";
import axiosInstance from "../api/axiosInstance";
import styles from "./AdminPage.module.css";
import {
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaImage,
  FaBox,
  FaTags,
  FaDollarSign,
  FaFileAlt,
  FaUser,
} from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";

type ProductsResponse = Product[] | { $values?: Product[] };

const AdminPage: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<
    Omit<Product, "id" | "imageUrl">
  >({
    name: "",
    description: "",
    price: 0,
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && isAdmin) {
      fetchProducts();
    }
  }, [loading, isAdmin]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/admin/products");
      const data = response.data as ProductsResponse;
      const list: Product[] = Array.isArray(data)
        ? data
        : Array.isArray(data.$values)
          ? data.$values
          : [];
      setProducts(list);
      setError(null);
    } catch (err) {
      setError("Ошибка загрузки товаров");
      console.error(err);
      setProducts([]);
    }
  };

  const handleDelete = async (id: number) => {
    const previousProducts = products;

    try {
      setIsDeleting(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      await axiosInstance.delete(`/admin/products/${id}`);
      setError(null);
    } catch (err) {
      setProducts(previousProducts);
      setError("Ошибка удаления товара");
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAdd = async () => {
    if (!imageFile) {
      setError("Пожалуйста, выберите изображение");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      // ✅ Исправлено — цена всегда с точкой
      formData.append("price", newProduct.price.toFixed(2).replace(",", "."));
      formData.append("category", newProduct.category);
      formData.append("image", imageFile);

      await axiosInstance.post("/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewProduct({
        name: "",
        description: "",
        price: 0,
        category: "",
      });
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
      setError(null);
    } catch (err) {
      setError("Ошибка добавления товара");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <BiLoaderAlt className={styles.loadingSpinner} />
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const totalProducts = products.length;
  const totalCategories = new Set(products.map((p) => p.category)).size;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <button
          className={styles.navButton}
          onClick={() => navigate("/catalog")}
        >
          <FaArrowLeft /> Вернуться в каталог
        </button>
        <h1>Панель управления</h1>
        <button
          className={styles.navButton}
          onClick={() => navigate("/admin/users")}
        >
          <FaUser /> Управление пользователями
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalProducts}</div>
          <div className={styles.statLabel}>Товаров</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalCategories}</div>
          <div className={styles.statLabel}>Категорий</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {totalValue.toLocaleString("ru-RU")} ₽
          </div>
          <div className={styles.statLabel}>Общая стоимость</div>
        </div>
      </div>

      <div className={styles.addProductForm}>
        <h2>
          <FaPlus className={styles.headerIcon} />
          Добавить новый товар
        </h2>
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <FaBox className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Название товара"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </div>
          <div className={styles.inputWrapper}>
            <FaFileAlt className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Описание товара"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </div>
          <div className={styles.inputWrapper}>
            <FaDollarSign className={styles.inputIcon} />
            <input
              type="number"
              placeholder="Цена"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: Number(e.target.value) })
              }
            />
          </div>
          <div className={styles.fileInputContainer}>
            <label className={styles.fileInputLabel}>
              <FaImage style={{ marginRight: "8px" }} />
              {imageFile ? "Изменить изображение" : "Выбрать изображение"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setImageFile(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setImagePreview(null);
                  }
                }}
                required
                className={styles.fileInput}
              />
            </label>
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Предпросмотр" />
              </div>
            )}
          </div>
          <div className={styles.inputWrapper}>
            <FaTags className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Категория"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={isSubmitting}
            className={styles.addButton}
          >
            {isSubmitting ? (
              <BiLoaderAlt className={styles.buttonSpinner} />
            ) : (
              <>
                <FaPlus /> Добавить товар
              </>
            )}
          </button>
        </div>
      </div>

      <div className={styles.productsSection}>
        <h2>Управление товарами</h2>
        <div className={styles.productsList}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.imageWrapper}>
                <img
                  src={`http://localhost:5091${product.imageUrl}`}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
              </div>
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p className={styles.productCategory}>{product.category}</p>
                <p className={styles.productPrice}>
                  {product.price.toLocaleString("ru-RU")} ₽
                </p>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={isDeleting === product.id}
                  className={styles.deleteButton}
                >
                  {isDeleting === product.id ? (
                    <BiLoaderAlt className={styles.buttonSpinner} />
                  ) : (
                    <>
                      <FaTrash /> Удалить
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
