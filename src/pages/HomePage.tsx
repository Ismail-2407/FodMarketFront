import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";

const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="home-container">
      <h1>
        Добро пожаловать в <span>FoodMarket</span>!
      </h1>
      <p>У нас вы найдете лучшие продукты по отличным ценам 🛒</p>

      <div className="home-buttons">
        {isAuthenticated ? (
          <>
            <Link to="/catalog" className="btn">
              Перейти в каталог
            </Link>
            <button onClick={logout} className="btn btn-secondary">
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">
              Войти
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Зарегистрироваться
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
