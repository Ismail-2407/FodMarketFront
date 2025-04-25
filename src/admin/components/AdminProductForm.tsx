import { useEffect, useState } from "react";
import styles from "./AdminProductForm.module.css";

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface Props {
  product: Product | null;
  onSaved: () => void;
}

const AdminProductForm = ({ product, onSaved }: Props) => {
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "",
  });

  useEffect(() => {
    if (product) setFormData(product);
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? +value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = product ? "PUT" : "POST";
    const url = product
      ? `http://localhost:5091/api/products/${product.id}`
      : "http://localhost:5091/api/products";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      category: "",
    });

    onSaved();
  };

  return (
    <div className={styles.formContainer}>
      <h2>{product ? "Редактировать товар" : "Добавить товар"}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          placeholder="Название"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Описание"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Цена"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          name="imageUrl"
          placeholder="URL изображения"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Категория"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <button type="submit">{product ? "Сохранить" : "Добавить"}</button>
      </form>
    </div>
  );
};

export default AdminProductForm;
