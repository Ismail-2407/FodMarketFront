import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./RegisterPage.module.css";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5091/api/auth/register", {
        email,
        password,
      });

      alert("Регистрация прошла успешно. Войдите в систему.");
      navigate("/login");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      alert("Ошибка регистрации. Попробуйте снова.");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.title}>Регистрация</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleRegister} className={styles.button}>
        Зарегистрироваться
      </button>
      <a href="/login" className={styles.link}>
        Уже есть аккаунт? Войти
      </a>
    </div>
  );
};

export default RegisterPage;
