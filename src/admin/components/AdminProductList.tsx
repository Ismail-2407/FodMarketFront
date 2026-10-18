import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./AdminProductList.module.css";
import { getProductName } from "../../i18n/categories";

interface Product {
  id: number;
  name: string;
  description: string;
  nameEn?: string | null;
  nameAz?: string | null;
  descriptionEn?: string | null;
  descriptionAz?: string | null;
  price: number;
  imageUrl: string;
  category: string;
}

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const AdminProductList: React.FC<Props> = ({ products, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={styles.list}>
      <h2>{t("admin.productListTitle")}</h2>
      {products.map((product) => (
        <div key={product.id} className={styles.item}>
          <div>
            <strong>{getProductName(product, i18n.language)}</strong> –{" "}
            {new Intl.NumberFormat(i18n.language).format(product.price)} ₽
          </div>
          <div className={styles.buttons}>
            <button onClick={() => onEdit(product)}>{t("admin.editProduct")}</button>
            <button onClick={() => onDelete(product.id)}>{t("admin.delete")}</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminProductList;
