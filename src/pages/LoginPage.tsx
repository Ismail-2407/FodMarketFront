import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import styles from "./LoginPage.module.css";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const role = await login(email, password);
      if (role === "Admin") {
        navigate("/admin");
      } else {
        const from = (location.state as { from?: string } | null)?.from;
        navigate(from === "/profile" ? "/profile" : "/catalog");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Неверный email или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleLogin} className={styles.formCard}>
        <h2 className={styles.title}>Вход в систему</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <FaEnvelope className={styles.inputIcon} />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <FaLock className={styles.inputIcon} />
        </div>

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? <FaSpinner className={styles.spinner} /> : "Войти"}
        </button>

        <div className={styles.links}>
          <Link to="/forgot-password" className={styles.link}>
            Забыли пароль?
          </Link>
          <Link to="/register" state={location.state} className={styles.link}>
            Нет аккаунта? Зарегистрируйтесь
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
