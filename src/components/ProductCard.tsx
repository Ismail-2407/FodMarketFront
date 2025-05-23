import React from "react";
import "./ProductCard.css";

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
}) => {
  return (
    <div className="product-card">
      <img src={imageUrl} alt={name} className="product-image" />
      <h3 className="product-title">{name}</h3>
      <p className="product-description">{description}</p>
      <p className="product-price">{price.toFixed(2)} ₽</p>
      <button className="add-to-cart-button" onClick={onAddToCart}>
        Добавить в корзину
      </button>
    </div>
  );
};

export default ProductCard;
