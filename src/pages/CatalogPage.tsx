import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../context/AuthContext";
import { Product } from "../types";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import AddressSelector from "../components/AddressSelector";
import styles from "./CatalogPage.module.css";
import axiosInstance from "../api/axiosInstance";
import {
  FaHome,
  FaSearch,
  FaMapMarkerAlt,
  FaChevronRight,
  FaLeaf,
} from "react-icons/fa";

Modal.setAppElement("#root");

const CatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("Все");
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/products");
        const data = res.data as { $values?: Product[] } | Product[];

        const list: Product[] = Array.isArray(
          (data as { $values?: Product[] }).$values,
        )
          ? (data as { $values: Product[] }).$values
          : Array.isArray(data)
            ? (data as Product[])
            : [];

        setProducts(list);
      } catch (error) {
        console.error("Ошибка при загрузке продуктов", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const uniqueCategories = useMemo(
    () => ["Все", ...new Set(products.map((p) => p.category))],
    [products],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        return (
          (category === "Все" || product.category === category) &&
          product.name.toLowerCase().includes(search.toLowerCase())
        );
      }),
    [category, products, search],
  );

  const stats = useMemo(
    () => [
      { label: "Товаров", value: filteredProducts.length },
      { label: "Категорий", value: Math.max(uniqueCategories.length - 1, 0) },
      { label: "Доставка", value: "30–60 мин" },
    ],
    [filteredProducts.length, uniqueCategories.length],
  );

  if (loading) return <div className={styles.title}>Загрузка...</div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <FaLeaf />
            <span>Свежие поставки ежедневно</span>
          </div>
          <h1>
            Каталог свежих продуктов
            <span className={styles.gradientText}> FoodMarket</span>
          </h1>
          <p>
            Быстрый поиск по категориям, удобная доставка и лучшие предложения
            каждого дня. Найдите всё необходимое для вкусной и здоровой еды.
          </p>
          <div className={styles.heroActions}>
            <button
              className={styles.homeButton}
              onClick={() => navigate("/home")}
            >
              <FaHome />
              На главную
            </button>
            {isAdmin && (
              <button
                className={styles.adminButton}
                onClick={() => navigate("/admin")}
              >
                Перейти в админку
              </button>
            )}
          </div>
          <div className={styles.stats}>
            {stats.map((item) => (
              <div key={item.label} className={styles.statCard}>
                <div className={styles.statValue}>{item.value}</div>
                <div className={styles.statLabel}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.heroGlass}></div>
      </div>

      <div className={styles.catalogContainer}>
        <div className={styles.controlsBar}>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <button
            className={styles.addressButton}
            onClick={() => setIsModalOpen(true)}
          >
            <FaMapMarkerAlt />
            <span>Уточнить адрес доставки</span>
            <FaChevronRight className={styles.chevron} />
          </button>
        </div>

        <div className={styles.categoryBar}>
          <div className={styles.categoryLabel}>Категории:</div>
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
              productId={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              imageUrl={`http://localhost:5091${product.imageUrl}`}
            />
          ))}
        </div>
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
