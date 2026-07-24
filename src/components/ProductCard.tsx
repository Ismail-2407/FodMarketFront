import React, { useState } from "react";
import { FaShoppingCart, FaStar, FaHeart, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  productId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating?: number;
  isHot?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  name,
  description,
  price,
  imageUrl,
  rating = 4.8,
  isHot = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(productId);
      setNotification("Product added to cart");
      window.setTimeout(() => setNotification(null), 2200);
    } catch {
      alert("Failed to add product to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHot && <div className="product-badge">Hot Deal</div>}
      <div className="image-container">
        <img src={imageUrl} alt={name} className="product-image" />
        <button
          type="button"
          className={`like-button ${isLiked ? "liked" : ""}`}
          onClick={handleLikeClick}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <FaHeart />
        </button>
      </div>
      <h3 className="product-title">{name}</h3>
      <p className="product-description">{description}</p>
      <div className="product-rating">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`star-icon ${index < Math.floor(rating) ? "filled" : ""}`}
          />
        ))}
        <span className="rating-count">({rating})</span>
      </div>
      <p className="product-price">{price.toLocaleString("en-US")}</p>
      <button
        type="button"
        className={`add-to-cart-button ${isHovered ? "hovered" : ""}`}
        onClick={() => void handleAddToCart()}
        disabled={isAdding}
      >
        {isAdding ? (
          <span className="button-text">Adding...</span>
        ) : (
          <>
            <FaPlus className="cart-icon" />
            <FaShoppingCart className="cart-icon" />
            <span className="button-text">Add to Cart</span>
          </>
        )}
      </button>

      {notification && (
        <div className="cart-notification" role="status">
          {notification}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
