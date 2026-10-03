import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaStar, FaHeart, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ProductCard.css";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { addFavorite, fetchFavoriteIds, removeFavorite } from "../api/profile";

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
  const [isFavoriteBusy, setIsFavoriteBusy] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) {
      setIsLiked(false);
      return () => {
        active = false;
      };
    }

    setIsFavoriteBusy(true);
    fetchFavoriteIds()
      .then((ids) => {
        if (active) setIsLiked(ids.includes(productId));
      })
      .catch((error: unknown) => {
        console.error("Failed to load favorite products:", error);
      })
      .finally(() => {
        if (active) setIsFavoriteBusy(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated, productId]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsFavoriteBusy(true);
    try {
      if (isLiked) {
        await removeFavorite(productId);
      } else {
        await addFavorite(productId);
      }
      setIsLiked(!isLiked);
    } catch (error: unknown) {
      console.error("Failed to update favorite:", error);
    } finally {
      setIsFavoriteBusy(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(productId);
      setNotification(t("product.addedToCart"));
      window.setTimeout(() => setNotification(null), 2200);
    } catch {
      alert(t("product.addToCartFailed"));
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
      {isHot && <div className="product-badge">{t("product.hotDeal")}</div>}
      <div className="image-container">
        <img src={imageUrl} alt={name} className="product-image" />
        <button
          type="button"
          className={`like-button ${isLiked ? "liked" : ""}`}
          onClick={(event) => void handleLikeClick(event)}
          disabled={isFavoriteBusy}
          aria-label={
            isLiked
              ? t("product.removeFromFavorites")
              : t("product.addToFavorites")
          }
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
          <span className="button-text">{t("product.adding")}</span>
        ) : (
          <>
            <FaPlus className="cart-icon" />
            <FaShoppingCart className="cart-icon" />
            <span className="button-text">{t("product.addToCart")}</span>
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
