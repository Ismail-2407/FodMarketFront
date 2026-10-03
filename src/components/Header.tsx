import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Header.css";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="container">
        <Link to="/home" className="logo">
          FoodMarket
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/home">{t("nav.home")}</Link>
            </li>
            <li>
              <Link to="/catalog">{t("nav.catalog")}</Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="cart-link"
                aria-label={t("nav.cartAria")}
              >
                <FaShoppingCart />
                <span>{t("nav.cart")}</span>
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount}</span>
                )}
              </Link>
            </li>
            <li>
              <LanguageSwitcher />
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/my-orders" className="my-orders-btn">
                  {t("nav.myOrders")}
                </Link>
              </li>
            )}
            <li>
              <Link to="/profile" className="profile-btn">
                {t("nav.myAccount")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
