import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Product } from "../types";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import AddressSelector from "../components/AddressSelector";
import styles from "./CatalogPage.module.css";
import axiosInstance from "../api/axiosInstance";

Modal.setAppElement("#root"); // обязательно для a11y

const CatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("Все");
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { fetchCart } = useCart();
  const { isAdmin, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Ошибка при загрузке продуктов", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await axiosInstance.post(`/cart/add/${productId}`);
      await fetchCart();
      alert("Товар добавлен в корзину");
    } catch (error) {
      console.error(error);
      if ((error as any)?.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Ошибка при добавлении в корзину");
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    return (
      (category === "Все" || product.category === category) &&
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const uniqueCategories = ["Все", ...new Set(products.map((p) => p.category))];

  if (loading) return <div className={styles.title}>Загрузка...</div>;

  return (
    <div className={styles.catalogContainer}>
      <div className={styles.actions}>
        {isAdmin && (
          <button
            className={styles.adminButton}
            onClick={() => navigate("/admin")}
          >
            Перейти в админку
          </button>
        )}

        <h1 className={styles.title}>Каталог товаров</h1>

        <button
          className={styles.goToCartBtn}
          onClick={() => navigate("/cart")}
        >
          Перейти в корзину
        </button>

        <button
          className={styles.addressButton}
          onClick={() => setIsModalOpen(true)}
        >
          Уточните адрес доставки
        </button>
      </div>

      <div className={styles.topBar}>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.categoryButtons}>
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`${styles.categoryButton} ${
                category === cat ? styles.active : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            imageUrl={product.imageUrl}
            onAddToCart={() => handleAddToCart(product.id)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <AddressSelector onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default CatalogPage;
