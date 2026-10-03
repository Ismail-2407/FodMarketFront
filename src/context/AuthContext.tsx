import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

type User = {
  role: string | null;
  email?: string;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Если токена нет — сразу не авторизован
        if (!token) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get("/auth/check");
        if (response.data?.role) {
          setIsAuthenticated(true);
          setCurrentUser({
            role: response.data.role,
            email: response.data.email,
          });
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch {
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (response.data?.role) {
        setIsAuthenticated(true);
        setCurrentUser({ role: response.data.role, email });

        // ✅ Сохраняем токен в localStorage
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }

        return response.data.role;
      } else {
        throw new Error("Login failed: role not returned");
      }
    } catch (error) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
      // ✅ Удаляем токен из localStorage
      localStorage.removeItem("token");
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    isAdmin: currentUser?.role === "Admin",
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
