import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CatalogPage from "./pages/CatalogPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />}
      />
      <Route
        path="/catalog"
        element={isAuthenticated ? <CatalogPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin"
        element={
          isAuthenticated && isAdmin ? <AdminPage /> : <Navigate to="/" />
        }
      />
      <Route
        path="/cart"
        element={isAuthenticated ? <CartPage /> : <Navigate to="/login" />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
