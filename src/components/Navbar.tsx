import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>FoodMarket</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/catalog">Catalog</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
