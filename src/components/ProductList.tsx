import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";

type Product = {
  id: number;
  name: string;
  description: string;
  nameEn?: string | null;
  nameAz?: string | null;
  descriptionEn?: string | null;
  descriptionAz?: string | null;
  price: number;
  imageUrl: string;
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5091/api/products");
        if (!res.ok) {
          throw new Error("Failed to load products");
        }
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.$values)
            ? data.$values
            : [];
        setProducts(list);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchProducts();
  }, []);

  return (
    <div className="product-list">
      {products.map((product) => (
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
  );
};

export default ProductList;
