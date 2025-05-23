import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/account/forgot-password", {
        email,
        clientUrl: "http://localhost:5173",
      });
      setMessage("Письмо для сброса пароля отправлено, проверьте почту.");
    } catch (error) {
      setMessage("Произошла ошибка, попробуйте позже.");
    }
  };

  return (
    <div className="form-container">
      <h2>Забыли пароль?</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Введите ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input"
        />
        <button type="submit" className="form-button">
          Отправить письмо
        </button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
