import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="navbar">
      <h1>FoodMarket</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/catalog">Catalog</Link>
        <Link to="/cart" className="cart-link">
          <FaShoppingCart />
          Cart
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/logout">Logout</Link>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
