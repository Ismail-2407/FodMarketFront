import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./AdminProductForm.module.css";

interface Product {
  id?: number;
  name: string;
  description: string;
  nameEn?: string | null;
  nameAz?: string | null;
  descriptionEn?: string | null;
  descriptionAz?: string | null;
  price: number;
  category: string;
}

type ProductFormData = Omit<
  Product,
  "nameEn" | "nameAz" | "descriptionEn" | "descriptionAz"
> & {
  nameEn: string;
  nameAz: string;
  descriptionEn: string;
  descriptionAz: string;
};

interface Props {
  product: Product | null;
  onSaved: () => void;
}

const AdminProductForm = ({ product, onSaved }: Props) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProductFormData>({
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

  useEffect(() => {
    if (product) {
      // When editing, prefill text fields but reset image file selection.
      const {
        id,
        name,
        description,
        nameEn,
        nameAz,
        descriptionEn,
        descriptionAz,
        price,
        category,
      } = product;
      setFormData({
        id,
        name,
        description,
        nameEn: nameEn ?? "",
        nameAz: nameAz ?? "",
        descriptionEn: descriptionEn ?? "",
        descriptionAz: descriptionAz ?? "",
        price,
        category,
      });
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
    for (const field of ["nameEn", "nameAz", "descriptionEn", "descriptionAz"] as const) {
      if (method === "PUT" || formData[field].trim()) {
        formDataToSend.append(field, formData[field]);
      }
    }
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
      nameEn: "",
      nameAz: "",
      descriptionEn: "",
      descriptionAz: "",
      price: 0,
      category: "",
    });

    setImageFile(null);
    setImagePreview(null);

    onSaved();
  };

  return (
    <div className={styles.formContainer}>
      <h2>
        {product ? t("admin.editProductTitle") : t("admin.addProductTitle")}
      </h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          placeholder={t("admin.productName")}
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder={t("admin.productDescription")}
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="nameEn"
          placeholder={t("admin.productNameEnglish")}
          value={formData.nameEn}
          onChange={handleChange}
        />
        <input
          name="nameAz"
          placeholder={t("admin.productNameAzerbaijani")}
          value={formData.nameAz}
          onChange={handleChange}
        />
        <input
          name="descriptionEn"
          placeholder={t("admin.productDescriptionEnglish")}
          value={formData.descriptionEn}
          onChange={handleChange}
        />
        <input
          name="descriptionAz"
          placeholder={t("admin.productDescriptionAzerbaijani")}
          value={formData.descriptionAz}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder={t("admin.productPrice")}
          value={formData.price}
          onChange={handleChange}
          required
        />
        <div className={styles.fileInputContainer}>
          <label className={styles.fileInputLabel}>
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
              required={!product}
              className={styles.fileInput}
            />
          </label>
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt={t("admin.previewAlt")} />
            </div>
          )}
          {product && !imageFile && (
            <p className={styles.imageHint}>
              {t("admin.currentImageHint")}
            </p>
          )}
        </div>
        <input
          name="category"
          placeholder={t("admin.category")}
          value={formData.category}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {product ? t("admin.saveChanges") : t("admin.addProduct")}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
