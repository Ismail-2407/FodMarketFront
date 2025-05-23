import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

type CartItem = {
  productId: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function parseToken(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, logout } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTokenValid = useCallback(() => {
    if (!token) return false;
    const decoded = parseToken(token);
    if (!decoded) {
      logout();
      return false;
    }
    const expiration = decoded.exp * 1000;
    if (Date.now() > expiration) {
      logout();
      return false;
    }
    return true;
  }, [token, logout]);

  const fetchCart = useCallback(async () => {
    if (!isTokenValid()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get("/cart");
      setCart(res.data);
    } catch (err: unknown) {
      console.error("Ошибка при загрузке корзины:", err);
      setError("Не удалось загрузить корзину.");
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [isTokenValid]);

  const addToCart = useCallback(
    async (productId: number, quantity = 1) => {
      if (!isTokenValid()) return;

      setLoading(true);
      setError(null);

      try {
        await axiosInstance.post("/cart/", { productId, quantity });
        await fetchCart();
      } catch (err: unknown) {
        console.error("Ошибка при добавлении в корзину:", err);
        setError("Не удалось добавить товар в корзину.");
      } finally {
        setLoading(false);
      }
    },
    [isTokenValid, fetchCart]
  );

  const removeFromCart = useCallback(
    async (productId: number) => {
      if (!isTokenValid()) return;

      setLoading(true);
      setError(null);

      try {
        await axiosInstance.delete(`/cart/${productId}`);
        await fetchCart();
      } catch (err: unknown) {
        console.error("Ошибка при удалении из корзины:", err);
        setError("Не удалось удалить товар из корзины.");
      } finally {
        setLoading(false);
      }
    },
    [isTokenValid, fetchCart]
  );

  const clearCart = useCallback(async () => {
    if (!isTokenValid()) return;

    setLoading(true);
    setError(null);

    try {
      await axiosInstance.delete("/cart/clear");
      setCart([]);
    } catch (err: unknown) {
      console.error("Ошибка при очистке корзины:", err);
      setError("Не удалось очистить корзину.");
    } finally {
      setLoading(false);
    }
  }, [isTokenValid]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const value: CartContextType = {
    cart,
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
    loading,
    error,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
