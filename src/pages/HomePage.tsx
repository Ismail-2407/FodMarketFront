import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";
import {
  FaShoppingBasket,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaLeaf,
  FaTruck,
  FaShieldAlt,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";

const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();

  const features = [
    {
      icon: <FaLeaf />,
      title: "Свежие продукты",
      description: "Только свежие и качественные продукты каждый день",
    },
    {
      icon: <FaTruck />,
      title: "Быстрая доставка",
      description: "Доставка в удобное для вас время и место",
    },
    {
      icon: <FaShieldAlt />,
      title: "Безопасные платежи",
      description: "Защищённые и удобные способы оплаты",
    },
    {
      icon: <FaStar />,
      title: "Лучшие цены",
      description: "Конкурентные цены и специальные предложения",
    },
  ];

  return (
    <div className="home-container">
      <div className="home-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="home-content">
        <div className="hero-section">
          <div className="badge">
            <FaLeaf className="badge-icon" />
            <span>Экологичные продукты</span>
          </div>
          <h1>
            Добро пожаловать в <span className="gradient-text">FoodMarket</span>
          </h1>
          <p className="hero-description">
            Откройте для себя мир свежих продуктов, отличных цен и превосходного
            качества. Ваш идеальный выбор для покупок продуктов онлайн!
          </p>

          <div className="home-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/catalog" className="btn btn-primary">
                  <FaShoppingBasket />
                  <span>Перейти в каталог</span>
                  <FaArrowRight className="btn-arrow" />
                </Link>
                <button onClick={logout} className="btn btn-secondary">
                  <FaSignOutAlt />
                  <span>Выйти</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  <FaSignInAlt />
                  <span>Войти</span>
                  <FaArrowRight className="btn-arrow" />
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  <FaUserPlus />
                  <span>Зарегистрироваться</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="features-section">
          <h2 className="features-title">Почему выбирают нас</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
