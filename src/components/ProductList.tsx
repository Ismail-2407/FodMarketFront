import React from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";

const mockProducts = [
  { name: "Яблоко", price: 59.99, imageUrl: "/images/apple.jpg" },
  { name: "Молоко", price: 89.5, imageUrl: "/images/milk.jpg" },
  { name: "Хлеб", price: 49.0, imageUrl: "/images/bread.jpg" },
];

const ProductList: React.FC = () => {
  return (
    <div className="product-list">
      {mockProducts.map((product, i) => (
        <ProductCard key={i} {...product} />
      ))}
    </div>
  );
};

export default ProductList;
