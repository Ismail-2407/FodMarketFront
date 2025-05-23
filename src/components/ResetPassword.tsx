import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/account/reset-password", {
        email,
        token,
        newPassword,
      });
      setMessage("Пароль успешно изменён!");
    } catch (error) {
      setMessage("Ошибка при сбросе пароля.");
    }
  };

  return (
    <div className="form-container">
      <h2>Сброс пароля</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Введите новый пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="form-input"
        />
        <button type="submit" className="form-button">
          Изменить пароль
        </button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default ResetPassword;
