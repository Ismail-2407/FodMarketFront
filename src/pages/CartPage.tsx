import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaShoppingBasket,
  FaArrowLeft,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import PaymentModal from "../components/PaymentModal";
import { createOrder, PaymentMethod } from "../api/orders";
import styles from "./CartPage.module.css";

const IMAGE_BASE = "http://localhost:5091";

function CartPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    items,
    total,
    loading,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const productIds = useMemo(
    () =>
      items.flatMap((item) =>
        Array.from({ length: item.quantity }, () => item.productId)
      ),
    [items]
  );

  if (authLoading) {
    return <div className={styles.page}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleQuantityChange = async (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setUpdatingId(productId);
    try {
      await updateQuantity(productId, quantity);
    } catch {
      alert("Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId: number) => {
    setUpdatingId(productId);
    try {
      await removeFromCart(productId);
    } catch {
      alert("Failed to remove product");
    } finally {
      setUpdatingId(null);
    }
  };

  const placeOrder = async (paymentMethod: PaymentMethod) => {
    if (productIds.length === 0) return;

    setIsPlacingOrder(true);
    try {
      await createOrder(productIds, paymentMethod);
      await clearCart();
      setIsPaymentOpen(false);
      alert("Order placed successfully!");
      navigate("/catalog");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/catalog")}
        >
          <FaArrowLeft />
          Back to Catalog
        </button>
        <h1>
          <FaShoppingBasket /> Your Cart
        </h1>
      </div>

      {loading ? (
        <p className={styles.empty}>Loading cart...</p>
      ) : items.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.empty}>Your cart is empty</p>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => navigate("/catalog")}
          >
            Browse Catalog
          </button>
        </div>
      ) : (
        <>
          <ul className={styles.list}>
            {items.map((item) => {
              const imageSrc = item.imageUrl.startsWith("http")
                ? item.imageUrl
                : `${IMAGE_BASE}${item.imageUrl}`;

              return (
                <li key={item.productId} className={styles.item}>
                  <img src={imageSrc} alt={item.name} className={styles.image} />
                  <div className={styles.info}>
                    <h3>{item.name}</h3>
                    <p className={styles.price}>
                      {item.price.toLocaleString("en-US")} ₽
                    </p>
                    <div className={styles.quantityRow}>
                      <button
                        type="button"
                        className={styles.qtyButton}
                        disabled={updatingId === item.productId || item.quantity <= 1}
                        onClick={() =>
                          void handleQuantityChange(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        aria-label="Decrease quantity"
                      >
                        <FaMinus />
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        type="button"
                        className={styles.qtyButton}
                        disabled={updatingId === item.productId}
                        onClick={() =>
                          void handleQuantityChange(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        aria-label="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <p className={styles.lineTotal}>
                      {(item.price * item.quantity).toLocaleString("en-US")} ₽
                    </p>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      disabled={updatingId === item.productId}
                      onClick={() => void handleRemove(item.productId)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className={styles.summary}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <strong>{total.toLocaleString("en-US")} ₽</strong>
            </div>
            <button
              type="button"
              className={styles.primaryButton}
              disabled={isPlacingOrder}
              onClick={() => setIsPaymentOpen(true)}
            >
              Place Order
            </button>
          </div>
        </>
      )}

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={total}
        isSubmitting={isPlacingOrder}
        onConfirm={(method) => void placeOrder(method)}
      />
    </div>
  );
}

export default CartPage;
