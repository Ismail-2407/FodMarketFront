import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="Admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
