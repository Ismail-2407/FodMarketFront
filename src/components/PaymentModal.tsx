import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./PaymentModal.css";
import { FaMoneyBill, FaPaypal } from "react-icons/fa";
import { PayPalButtons } from "@paypal/react-paypal-js";
import type { PaymentMethod } from "../api/orders";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: PaymentMethod) => void;
  amount: number;
  isSubmitting?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  isSubmitting = false,
}) => {
  const { t, i18n } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | "">("");

  if (!isOpen) return null;

  const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] =
    [
      {
        id: "Cash",
        label: t("payment.cash"),
        icon: <FaMoneyBill />,
      },
      {
        id: "PayPal",
        label: t("payment.paypal"),
        icon: <FaPaypal />,
      },
    ];

  const handleConfirmCash = () => {
    if (selectedMethod !== "Cash" || isSubmitting) return;
    onConfirm("Cash");
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{t("payment.title")}</h2>
        <p className="payment-amount">
          {t("payment.amount")}{" "}
          <strong>{new Intl.NumberFormat(i18n.language).format(amount)} ₽</strong>
        </p>

        <div className="payment-methods">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-method ${
                selectedMethod === method.id ? "selected" : ""
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <span className="payment-method-icon">{method.icon}</span>
              <span className="payment-method-label">{method.label}</span>
            </div>
          ))}
        </div>

        {selectedMethod === "PayPal" && (
          <div className="paypal-buttons">
            <PayPalButtons
              disabled={isSubmitting}
              style={{ layout: "vertical" }}
              createOrder={(_, actions) => {
                if (!actions.order) {
                  return Promise.reject(
                    new Error("PayPal actions are unavailable")
                  );
                }

                const usdValue = Math.max(Number(amount) || 0, 0.01).toFixed(2);

                return actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: usdValue,
                      },
                    },
                  ],
                });
              }}
              onApprove={async (_, actions) => {
                if (!actions.order) {
                  throw new Error("PayPal order is unavailable");
                }

                await actions.order.capture();
                onConfirm("PayPal");
              }}
              onError={(err) => {
                console.error("PayPal error:", err);
                alert(t("payment.paypalFailed"));
              }}
            />
          </div>
        )}

        {selectedMethod === "Cash" && (
          <div className="modal-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("payment.cancel")}
            </button>
            <button
              type="button"
              className="confirm-button"
              onClick={handleConfirmCash}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("payment.placingOrder")
                : t("payment.confirmCash")}
            </button>
          </div>
        )}

        {!selectedMethod && (
          <div className="modal-buttons">
            <button type="button" className="cancel-button" onClick={onClose}>
              {t("payment.cancel")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
