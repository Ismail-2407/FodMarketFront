import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthForm.module.css";

type LoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await axios.post(
        "http://localhost:5091/api/auth/login",
        data
      );
      console.log("Login success:", response.data);

      if (response.data.token) {
        login(response.data.token);
        navigate("/catalog");
      } else {
        alert("Ошибка: токен не получен от сервера.");
      }
    } catch (error) {
      console.error("Login Failed:", error);
      alert("Ошибка входа. Проверьте email и пароль.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          {...register("email")}
          placeholder="Email"
          required
        />
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className={styles.link}>
        <Link to="/register">Don't have an account? Register</Link>
      </div>
    </div>
  );
};

export default LoginPage;
