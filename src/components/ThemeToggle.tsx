import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={
        isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
      }
      title={isDarkTheme ? "Light theme" : "Dark theme"}
    >
      <span className="theme-toggle__icon">
        {isDarkTheme ? <FaSun /> : <FaMoon />}
      </span>
      <span className="theme-toggle__label">
        {isDarkTheme ? "Light" : "Dark"}
      </span>
    </button>
  );
};

export default ThemeToggle;
