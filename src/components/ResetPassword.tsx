import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";
import { FaLock, FaCheck } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";

interface Message {
  text: string;
  type: "success" | "error";
}

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<Message | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    checkPasswordStrength(newPass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordStrength < 3) {
      setMessage({
        text: "⚠️ Пароль слишком слабый. Используйте буквы, цифры и специальные символы.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ Убрали /api/ в начале — axiosInstance уже имеет baseURL с /api
      await axiosInstance.post("/account/reset-password", {
        email,
        token,
        newPassword,
      });
      setMessage({
        text: "✅ Пароль успешно изменён! Теперь вы можете войти с новым паролем.",
        type: "success",
      });
      setNewPassword("");
      setPasswordStrength(0);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setMessage({
            text: "⛔️ Недействительный или просроченный токен.",
            type: "error",
          });
        } else if (error.response?.status === 400) {
          setMessage({
            text: "⚠️ Невозможно сбросить пароль. Проверьте данные.",
            type: "error",
          });
        } else {
          setMessage({
            text: "❌ Ошибка при сбросе пароля.",
            type: "error",
          });
        }
      } else {
        setMessage({
          text: "❌ Непредвиденная ошибка.",
          type: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>
        <FaLock style={{ marginRight: "10px" }} />
        Сброс пароля
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="password-input-wrapper">
          <input
            type="password"
            placeholder="Введите новый пароль"
            value={newPassword}
            onChange={handlePasswordChange}
            required
            className="form-input"
            disabled={isSubmitting}
          />
          {passwordStrength > 0 && (
            <div className="password-strength">
              <div className={`strength-bar strength-${passwordStrength}`} />
              <span className="strength-text">
                {passwordStrength < 3
                  ? "Слабый пароль"
                  : passwordStrength < 4
                    ? "Средний пароль"
                    : "Сильный пароль"}
              </span>
            </div>
          )}
        </div>
        <button type="submit" className="form-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="button-content">
              <span className="spinner" />
              Изменение пароля...
            </span>
          ) : (
            <span className="button-content">
              {message?.type === "success" ? <FaCheck /> : <FaLock />}
              Изменить пароль
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

export default ResetPassword;
