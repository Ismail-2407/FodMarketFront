import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthForm.module.css";

type RegisterForm = {
  email: string;
  password: string;
};

const RegisterPage = () => {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await axios.post(
        "http://localhost:5091/api/auth/register",
        data
      );

      console.log("Registration success:", response.data);

      if (response.data.token) {
        login(response.data.token);
        navigate("/catalog");
      } else {
        alert("Ошибка: токен не получен.");
      }
    } catch (error) {
      console.error("Registration Failed:", error);
      alert("Ошибка регистрации. Возможно, такой email уже зарегистрирован.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Email" required />
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      <div className={styles.link}>
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
