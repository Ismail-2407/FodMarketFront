import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import styles from "./RegisterPage.module.css";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);

  const checkPasswordStrength = (pass: string) => {
    if (!pass) return null;
    const hasLower = /[a-z]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const length = pass.length;

    const strength =
      (hasLower ? 1 : 0) +
      (hasUpper ? 1 : 0) +
      (hasNumber ? 1 : 0) +
      (hasSpecial ? 1 : 0) +
      (length >= 8 ? 1 : 0);

    if (strength <= 2) return "weak";
    if (strength <= 4) return "medium";
    return "strong";
  };

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (passwordStrength === "weak") {
      setError(
        "Пароль слишком слабый. Добавьте заглавные буквы, цифры и специальные символы"
      );
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("http://localhost:5091/api/auth/register", {
        email,
        password,
      });

      navigate("/login", {
        state: {
          message: "Регистрация успешна! Теперь вы можете войти в систему.",
        },
      });
    } catch (error: unknown) {
      console.error("Ошибка регистрации:", error);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Ошибка регистрации. Попробуйте снова."
        );
      } else {
        setError("Произошла неизвестная ошибка");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "weak":
        return "Слабый пароль";
      case "medium":
        return "Средний пароль";
      case "strong":
        return "Сильный пароль";
      default:
        return "";
    }
  };

  return (
    <div className={styles.registerContainer}>
      <form onSubmit={handleRegister} className={styles.formCard}>
        <h2 className={styles.title}>Регистрация</h2>
        <p className={styles.subtitle}>
          Создайте аккаунт для доступа к нашему магазину
        </p>

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
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <FaLock className={styles.inputIcon} />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Показать/скрыть пароль"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {password && (
          <div className={styles.passwordStrength}>
            <div className={styles.passwordStrengthText}>
              {getPasswordStrengthText()}
            </div>
            <div className={styles.passwordStrengthBar}>
              <div
                className={`${styles.passwordStrengthFill} ${
                  styles[passwordStrength || ""]
                }`}
              />
            </div>
          </div>
        )}

        <div className={styles.inputGroup}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            required
          />
          <FaLock className={styles.inputIcon} />
        </div>

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? (
            <FaSpinner className={styles.spinner} />
          ) : (
            "Зарегистрироваться"
          )}
        </button>

        <Link to="/login" className={styles.link}>
          Уже есть аккаунт? Войти
        </Link>
      </form>
    </div>
  );
};

export default RegisterPage;
