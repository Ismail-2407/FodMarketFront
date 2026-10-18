import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";
import { getProductName, translateCategory } from "../i18n/categories";
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

const ALL_CATEGORY = "__all__";

const CatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>(ALL_CATEGORY);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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
    () => [ALL_CATEGORY, ...new Set(products.map((p) => p.category))],
    [products],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        return (
          (category === ALL_CATEGORY || product.category === category) &&
          (getProductName(product, i18n.language)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
            product.name.toLowerCase().includes(search.toLowerCase()))
        );
      }),
    [category, i18n.language, products, search],
  );

  const stats = useMemo(
    () => [
      { label: t("catalog.statsProducts"), value: filteredProducts.length },
      {
        label: t("catalog.statsCategories"),
        value: Math.max(uniqueCategories.length - 1, 0),
      },
      { label: t("catalog.statsDelivery"), value: t("catalog.statsDeliveryValue") },
    ],
    [filteredProducts.length, uniqueCategories.length, t],
  );

  if (loading) return <div className={styles.title}>{t("catalog.loading")}</div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <FaLeaf />
            <span>{t("catalog.badge")}</span>
          </div>
          <h1>
            {t("catalog.title")}
            <span className={styles.gradientText}> FoodMarket</span>
          </h1>
          <p>{t("catalog.description")}</p>
          <div className={styles.heroActions}>
            <button
              className={styles.homeButton}
              onClick={() => navigate("/home")}
            >
              <FaHome />
              {t("catalog.backHome")}
            </button>
            {isAdmin && (
              <button
                className={styles.adminButton}
                onClick={() => navigate("/admin")}
              >
                {t("catalog.goToAdmin")}
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
              placeholder={t("catalog.searchPlaceholder")}
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
            <span>{t("catalog.addressButton")}</span>
            <FaChevronRight className={styles.chevron} />
          </button>
        </div>

        <div className={styles.categoryBar}>
          <div className={styles.categoryLabel}>{t("catalog.categoriesLabel")}</div>
          <div className={styles.categoryButtons}>
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`${styles.categoryButton} ${
                  category === cat ? styles.active : ""
                }`}
              >
                {cat === ALL_CATEGORY
                  ? t("catalog.allCategories")
                  : translateCategory(cat, t)}
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
              nameEn={product.nameEn}
              nameAz={product.nameAz}
              descriptionEn={product.descriptionEn}
              descriptionAz={product.descriptionAz}
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
