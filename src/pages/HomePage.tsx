import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>
        Добро пожаловать в <span>FoodMarket</span>!
      </h1>
      <p>У нас вы найдете лучшие продукты по отличным ценам 🛒</p>
      <div className="home-buttons">
        <Link to="/login" className="btn">
          Войти
        </Link>
        <Link to="/register" className="btn btn-secondary">
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
