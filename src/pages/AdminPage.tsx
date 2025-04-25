import { useEffect, useState } from "react";
import AdminProductList from "../admin/components/AdminProductList";
import AdminProductForm from "../admin/components/AdminProductForm";
import styles from "./AdminPage.module.css";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5091/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:5091/api/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  const handleSaved = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Админ-панель</h1>
      <div className={styles.content}>
        <div className={styles.formSection}>
          <AdminProductForm product={editingProduct} onSaved={handleSaved} />
        </div>
        <div className={styles.listSection}>
          <AdminProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
