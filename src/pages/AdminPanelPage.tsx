import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminPanelPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Админ-панель</h1>
      <p>Добро пожаловать, администратор!</p>
    </div>
  );
};

export default AdminPanelPage;
