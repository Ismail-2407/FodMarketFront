import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import CatalogPage from "./pages/CatalogPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import UsersPage from "./pages/UsersPage";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ThemeToggle from "./components/ThemeToggle";
import Header from "./components/Header";
import "./styles/global.css";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <ThemeToggle />
        Loading...
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header />
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route
          path="/cart"
          element={
            isAuthenticated ? <CartPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <RegisterPage />
          }
        />
        <Route
          path="/admin"
          element={isAdmin ? <AdminPage /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/admin/users"
          element={isAdmin ? <UsersPage /> : <Navigate to="/home" replace />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
