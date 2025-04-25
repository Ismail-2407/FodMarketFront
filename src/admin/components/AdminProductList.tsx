import React from "react";
import styles from "./AdminProductList.module.css";

interface Product {
  id: number;
  name: string;
  description: string;
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
  return (
    <div className={styles.list}>
      <h2>Список товаров</h2>
      {products.map((product) => (
        <div key={product.id} className={styles.item}>
          <div>
            <strong>{product.name}</strong> – {product.price} ₽
          </div>
          <div className={styles.buttons}>
            <button onClick={() => onEdit(product)}>Редактировать</button>
            <button onClick={() => onDelete(product.id)}>Удалить</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminProductList;
