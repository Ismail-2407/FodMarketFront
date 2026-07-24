import { useEffect, useState } from "react";
import styles from "./AdminProductForm.module.css";

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
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
    category: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      // When editing, prefill text fields but reset image file selection.
      const { id, name, description, price, category } = product;
      setFormData({ id, name, description, price, category });
      setImageFile(null);
      setImagePreview(null);
    }
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

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", String(formData.price));
    formDataToSend.append("category", formData.category);

    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    await fetch(url, {
      method,
      body: formDataToSend,
    });

    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
    });

    setImageFile(null);
    setImagePreview(null);

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
        <div className={styles.fileInputContainer}>
          <label className={styles.fileInputLabel}>
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
              required={!product}
              className={styles.fileInput}
            />
          </label>
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="Предпросмотр" />
            </div>
          )}
          {product && !imageFile && (
            <p className={styles.imageHint}>
              Текущее изображение будет сохранено, если новое не выбрано
            </p>
          )}
        </div>
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
