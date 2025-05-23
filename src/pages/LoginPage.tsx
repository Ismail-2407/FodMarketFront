import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./LoginPage.module.css";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const role = await login(email, password);
      if (role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/catalog");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Ошибка входа: проверьте email и пароль");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Вход</h2>
      {error && <div className={styles.error}>{error}</div>}
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
      <button onClick={handleLogin} className={styles.button}>
        Войти
      </button>

      <div className={styles.links}>
        <Link to="/forgot-password" className={styles.link}>
          Забыли пароль?
        </Link>
        <Link to="/register" className={styles.link}>
          Нет аккаунта? Зарегистрируйтесь
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
