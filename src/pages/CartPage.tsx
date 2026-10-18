import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { getProductName } from "../i18n/categories";
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
  const { t, i18n } = useTranslation();
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
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(i18n.language).format(value);

  if (authLoading) {
    return <div className={styles.page}>{t("cart.loading")}</div>;
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
      alert(t("cart.updateQtyFailed"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId: number) => {
    setUpdatingId(productId);
    try {
      await removeFromCart(productId);
    } catch {
      alert(t("cart.removeFailed"));
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
      alert(t("cart.orderSuccess"));
      navigate("/catalog");
    } catch (error) {
      console.error("Error placing order:", error);
      alert(t("cart.orderFailed"));
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
          {t("cart.backToCatalog")}
        </button>
        <h1>
          <FaShoppingBasket /> {t("cart.title")}
        </h1>
      </div>

      {loading ? (
        <p className={styles.empty}>{t("cart.loadingCart")}</p>
      ) : items.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.empty}>{t("cart.empty")}</p>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => navigate("/catalog")}
          >
            {t("cart.browseCatalog")}
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
                  <img
                    src={imageSrc}
                    alt={getProductName(item, i18n.language) || t("common.product")}
                    className={styles.image}
                  />
                  <div className={styles.info}>
                    <h3>
                      {getProductName(item, i18n.language) || t("common.product")}
                    </h3>
                    <p className={styles.price}>
                      {formatNumber(item.price)} ₽
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
                        aria-label={t("cart.decreaseQty")}
                      >
                        <FaMinus />
                      </button>
                      <span className={styles.quantity}>
                        {formatNumber(item.quantity)}
                      </span>
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
                        aria-label={t("cart.increaseQty")}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <p className={styles.lineTotal}>
                      {formatNumber(item.price * item.quantity)} ₽
                    </p>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      disabled={updatingId === item.productId}
                      onClick={() => void handleRemove(item.productId)}
                    >
                      <FaTrash /> {t("cart.delete")}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className={styles.summary}>
            <div className={styles.totalRow}>
              <span>{t("cart.total")}</span>
              <strong>{formatNumber(total)} ₽</strong>
            </div>
            <button
              type="button"
              className={styles.primaryButton}
              disabled={isPlacingOrder}
              onClick={() => setIsPaymentOpen(true)}
            >
              {t("cart.placeOrder")}
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
