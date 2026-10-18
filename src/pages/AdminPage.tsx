import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Product } from "../types";
import axiosInstance from "../api/axiosInstance";
import {
  getProductName,
  translateCategory,
} from "../i18n/categories";
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
type AdminErrorKey =
  | "admin.loadProductsError"
  | "admin.deleteProductError"
  | "admin.selectImageError"
  | "admin.addProductError";

const AdminPage: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<
    Omit<Product, "id" | "imageUrl"> & {
      nameEn: string;
      nameAz: string;
      descriptionEn: string;
      descriptionAz: string;
    }
  >({
    name: "",
    description: "",
    nameEn: "",
    nameAz: "",
    descriptionEn: "",
    descriptionAz: "",
    price: 0,
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<AdminErrorKey | null>(null);
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
      setError("admin.loadProductsError");
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
      setError("admin.deleteProductError");
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAdd = async () => {
    if (!imageFile) {
      setError("admin.selectImageError");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      if (newProduct.nameEn.trim()) formData.append("nameEn", newProduct.nameEn);
      if (newProduct.nameAz.trim()) formData.append("nameAz", newProduct.nameAz);
      if (newProduct.descriptionEn.trim()) {
        formData.append("descriptionEn", newProduct.descriptionEn);
      }
      if (newProduct.descriptionAz.trim()) {
        formData.append("descriptionAz", newProduct.descriptionAz);
      }
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
        nameEn: "",
        nameAz: "",
        descriptionEn: "",
        descriptionAz: "",
        price: 0,
        category: "",
      });
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
      setError(null);
    } catch (err) {
      setError("admin.addProductError");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <BiLoaderAlt className={styles.loadingSpinner} />
        <p>{t("admin.loading")}</p>
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
          <FaArrowLeft /> {t("admin.backToCatalog")}
        </button>
        <h1>{t("admin.dashboardTitle")}</h1>
        <button
          className={styles.navButton}
          onClick={() => navigate("/admin/users")}
        >
          <FaUser /> {t("admin.manageUsers")}
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{t(error)}</div>}

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalProducts}</div>
          <div className={styles.statLabel}>{t("admin.statsProducts")}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalCategories}</div>
          <div className={styles.statLabel}>{t("admin.statsCategories")}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {new Intl.NumberFormat(i18n.language).format(totalValue)} ₽
          </div>
          <div className={styles.statLabel}>{t("admin.statsTotalValue")}</div>
        </div>
      </div>

      <div className={styles.addProductForm}>
        <h2>
          <FaPlus className={styles.headerIcon} />
          {t("admin.addProductTitle")}
        </h2>
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <FaBox className={styles.inputIcon} />
            <input
              type="text"
              placeholder={t("admin.productName")}
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </div>
          <div className={styles.inputWrapper}>
            <FaBox className={styles.inputIcon} />
            <input
              type="text"
              placeholder={t("admin.productNameEnglish")}
              value={newProduct.nameEn}
              onChange={(e) =>
                setNewProduct({ ...newProduct, nameEn: e.target.value })
              }
            />
          </div>
          <div className={styles.inputWrapper}>
            <FaBox className={styles.inputIcon} />
            <input
              type="text"
              placeholder={t("admin.productNameAzerbaijani")}
              value={newProduct.nameAz}
              onChange={(e) =>
                setNewProduct({ ...newProduct, nameAz: e.target.value })
              }
            />
          </div>
          <div className={styles.inputWrapper}>
            <FaFileAlt className={styles.inputIcon} />
            <input
              type="text"
              placeholder={t("admin.productDescription")}
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </div>
          <div className={styles.inputWrapper}>
            <FaFileAlt className={styles.inputIcon} />
            <input
              type="text"
              placeholder={t("admin.productDescriptionEnglish")}
              value={newProduct.descriptionEn}
              onChange={(e) =>
                setNewProduct({ ...newProduct, descriptionEn: e.target.value })
              }
            />
          </div>
          <div className={styles.inputWrapper}>
            <FaFileAlt className={styles.inputIcon} />
            <input
              type="text"
              placeholder={t("admin.productDescriptionAzerbaijani")}
              value={newProduct.descriptionAz}
              onChange={(e) =>
                setNewProduct({ ...newProduct, descriptionAz: e.target.value })
              }
            />
          </div>
          <div className={styles.inputWrapper}>
            <FaDollarSign className={styles.inputIcon} />
            <input
              type="number"
              placeholder={t("admin.productPrice")}
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: Number(e.target.value) })
              }
            />
          </div>
          <div className={styles.fileInputContainer}>
            <label className={styles.fileInputLabel}>
              <FaImage style={{ marginRight: "8px" }} />
              {imageFile ? t("admin.changeImage") : t("admin.selectImage")}
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
                <img src={imagePreview} alt={t("admin.previewAlt")} />
              </div>
            )}
          </div>
          <div className={styles.inputWrapper}>
            <FaTags className={styles.inputIcon} />
            <input
              type="text"
              placeholder={t("admin.category")}
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
                <FaPlus /> {t("admin.addProduct")}
              </>
            )}
          </button>
        </div>
      </div>

      <div className={styles.productsSection}>
        <h2>{t("admin.manageProducts")}</h2>
        <div className={styles.productsList}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.imageWrapper}>
                <img
                  src={`http://localhost:5091${product.imageUrl}`}
                  alt={getProductName(product, i18n.language)}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
              </div>
              <div className={styles.productInfo}>
                <h3>{getProductName(product, i18n.language)}</h3>
                <p className={styles.productCategory}>
                  {translateCategory(product.category, t)}
                </p>
                <p className={styles.productPrice}>
                  {new Intl.NumberFormat(i18n.language).format(product.price)} ₽
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
                      <FaTrash /> {t("admin.delete")}
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
