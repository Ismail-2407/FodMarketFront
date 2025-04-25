import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">FoodMarket</h1>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Main</Link>
            </li>
            <li>
              <Link to="/catalog">Catalog</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
