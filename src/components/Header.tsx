import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Header.css";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="header">
      <div className="container">
        <Link to="/home" className="logo">
          FoodMarket
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/catalog">Catalog</Link>
            </li>
            <li>
              <Link to="/cart" className="cart-link" aria-label="Shopping cart">
                <FaShoppingCart />
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount}</span>
                )}
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/my-orders" className="my-orders-btn">
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="profile-btn">
                    My Account
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
