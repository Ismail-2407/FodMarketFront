import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const features = [
    {
      icon: <FaLeaf />,
      title: t("home.features.fresh.title"),
      description: t("home.features.fresh.description"),
    },
    {
      icon: <FaTruck />,
      title: t("home.features.delivery.title"),
      description: t("home.features.delivery.description"),
    },
    {
      icon: <FaShieldAlt />,
      title: t("home.features.payments.title"),
      description: t("home.features.payments.description"),
    },
    {
      icon: <FaStar />,
      title: t("home.features.prices.title"),
      description: t("home.features.prices.description"),
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
            <span>{t("home.badge")}</span>
          </div>
          <h1>
            {t("home.welcome")}{" "}
            <span className="gradient-text">FoodMarket</span>
          </h1>
          <p className="hero-description">{t("home.description")}</p>

          <div className="home-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/catalog" className="btn btn-primary">
                  <FaShoppingBasket />
                  <span>{t("home.goToCatalog")}</span>
                  <FaArrowRight className="btn-arrow" />
                </Link>
                <button onClick={logout} className="btn btn-secondary">
                  <FaSignOutAlt />
                  <span>{t("home.logout")}</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  <FaSignInAlt />
                  <span>{t("home.login")}</span>
                  <FaArrowRight className="btn-arrow" />
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  <FaUserPlus />
                  <span>{t("home.register")}</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="features-section">
          <h2 className="features-title">{t("home.whyUs")}</h2>
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
