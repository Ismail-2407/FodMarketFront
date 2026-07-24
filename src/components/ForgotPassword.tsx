import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./ForgotPassword.css";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";

interface Message {
  text: string;
  type: "success" | "error";
}

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<Message | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/account/forgot-password", {
        email,
        clientUrl: window.location.origin,
      });
      setMessage({
        text: "✉️ Письмо для сброса пароля отправлено! Проверьте вашу почту.",
        type: "success",
      });
      setEmail("");
    } catch (error: unknown) {
      setMessage({
        text: "❌ Произошла ошибка. Пожалуйста, проверьте email и попробуйте снова.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setMessage(null);
  };

  return (
    <div className="form-container">
      <h2>
        <FaEnvelope style={{ marginRight: "10px" }} />
        Восстановление пароля
      </h2>
      <p className="form-description">
        Введите email, указанный при регистрации, и мы отправим вам инструкции
        по сбросу пароля
      </p>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Введите ваш email"
            value={email}
            onChange={handleEmailChange}
            required
            className="form-input"
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className="form-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="button-content">
              <span className="spinner" />
              Отправка письма...
            </span>
          ) : (
            <span className="button-content">
              <FaPaperPlane />
              Отправить письмо
            </span>
          )}
        </button>
      </form>
      {message && (
        <div className={`form-message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
};

export default ForgotPassword;
