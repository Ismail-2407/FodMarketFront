import React from "react";
import "./ProductCard.css";

interface ProductCardProps {
  name: string;
  price: number;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, imageUrl }) => {
  return (
    <div className="product-card">
      <img src={imageUrl} alt={name} />
      <h3>{name}</h3>
      <p className="price">{price.toFixed(2)} ₽</p>
      <button>Добавить в корзину</button>
    </div>
  );
};

export default ProductCard;
