import { useEffect, useState } from "react";
import styles from "./CatalogPage.module.css";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:5091/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Ошибка загрузки продуктов:", err));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5091/api/products/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Ошибка загрузки категорий:", err));
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Каталог товаров</h1>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.select}
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.gridContainer}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.card}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className={styles.image}
            />
            <div className={styles.content}>
              <h3 className={styles.name}>{product.name}</h3>
              <p className={styles.description}>{product.description}</p>
              <p className={styles.price}>{product.price} ₽</p>
              <button
                className={styles.button}
                onClick={() => addToCart({ ...product, quantity: 1 })}
              >
                В корзину
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogPage;
