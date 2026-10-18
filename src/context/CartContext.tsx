import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosInstance from "../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";

export type CartItem = {
  productId: number;
  quantity: number;
  name: string;
  description?: string;
  nameEn?: string | null;
  nameAz?: string | null;
  descriptionEn?: string | null;
  descriptionAz?: string | null;
  price: number;
  imageUrl: string;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  total: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
};
type CartErrorKey =
  | "cartContext.loadFailed"
  | "cartContext.addFailed"
  | "cartContext.removeFailed"
  | "cartContext.updateFailed"
  | "cartContext.clearFailed";

const CartContext = createContext<CartContextType | undefined>(undefined);

function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.$values)) return obj.$values as T[];
    if (Array.isArray(obj.products)) return obj.products as T[];
    if (obj.products && typeof obj.products === "object") {
      const products = obj.products as Record<string, unknown>;
      if (Array.isArray(products.$values)) return products.$values as T[];
    }
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (obj.items && typeof obj.items === "object") {
      const items = obj.items as Record<string, unknown>;
      if (Array.isArray(items.$values)) return items.$values as T[];
    }
  }
  return [];
}

function normalizeCartItem(raw: Record<string, unknown>): CartItem | null {
  const nested =
    raw.product && typeof raw.product === "object"
      ? (raw.product as Record<string, unknown>)
      : null;

  const productId = Number(
    raw.productId ?? raw.ProductId ?? nested?.id ?? nested?.Id ?? raw.id ?? raw.Id
  );

  if (!Number.isFinite(productId)) return null;

  const quantity = Math.max(
    1,
    Number(raw.quantity ?? raw.Quantity ?? 1) || 1
  );

  const name = String(
    raw.name ?? raw.Name ?? nested?.name ?? nested?.Name ?? ""
  );
  const description = String(
    raw.description ??
      raw.Description ??
      nested?.description ??
      nested?.Description ??
      ""
  );
  const nameEn = raw.nameEn ?? raw.NameEn ?? nested?.nameEn ?? nested?.NameEn;
  const nameAz = raw.nameAz ?? raw.NameAz ?? nested?.nameAz ?? nested?.NameAz;
  const descriptionEn =
    raw.descriptionEn ??
    raw.DescriptionEn ??
    nested?.descriptionEn ??
    nested?.DescriptionEn;
  const descriptionAz =
    raw.descriptionAz ??
    raw.DescriptionAz ??
    nested?.descriptionAz ??
    nested?.DescriptionAz;

  const price = Number(
    raw.price ?? raw.Price ?? nested?.price ?? nested?.Price ?? 0
  );

  const imageUrl = String(
    raw.imageUrl ??
      raw.ImageUrl ??
      nested?.imageUrl ??
      nested?.ImageUrl ??
      ""
  );

  return {
    productId,
    quantity,
    name,
    description,
    nameEn: typeof nameEn === "string" ? nameEn : null,
    nameAz: typeof nameAz === "string" ? nameAz : null,
    descriptionEn: typeof descriptionEn === "string" ? descriptionEn : null,
    descriptionAz: typeof descriptionAz === "string" ? descriptionAz : null,
    price: Number.isFinite(price) ? price : 0,
    imageUrl,
  };
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<CartErrorKey | null>(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    setLoading(true);
    setErrorKey(null);

    try {
      const res = await axiosInstance.get("/cart");
      const list = asArray<Record<string, unknown>>(res.data)
        .map(normalizeCartItem)
        .filter((item): item is CartItem => item !== null);
      setItems(list);
    } catch (err) {
      console.error("Error loading cart:", err);
      setErrorKey("cartContext.loadFailed");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(
    async (productId: number) => {
      if (!isAuthenticated) return;

      setErrorKey(null);
      try {
        await axiosInstance.post(`/cart/add/${productId}`);
        await fetchCart();
      } catch (err) {
        console.error("Error adding to cart:", err);
        setErrorKey("cartContext.addFailed");
        throw err;
      }
    },
    [isAuthenticated, fetchCart]
  );

  const removeFromCart = useCallback(
    async (productId: number) => {
      if (!isAuthenticated) return;

      setErrorKey(null);
      try {
        await axiosInstance.delete(`/cart/remove/${productId}`);
        setItems((prev) => prev.filter((item) => item.productId !== productId));
      } catch (err) {
        console.error("Error removing from cart:", err);
        setErrorKey("cartContext.removeFailed");
        throw err;
      }
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (!isAuthenticated) return;

      const nextQuantity = Math.max(1, quantity);
      setErrorKey(null);

      try {
        await axiosInstance.put(`/cart/update/${productId}`, nextQuantity);
        setItems((prev) =>
          prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: nextQuantity }
              : item
          )
        );
      } catch (err) {
        console.error("Error updating cart quantity:", err);
        setErrorKey("cartContext.updateFailed");
        throw err;
      }
    },
    [isAuthenticated]
  );

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) return;

    setErrorKey(null);
    try {
      await axiosInstance.delete("/cart/clear");
      setItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
      setErrorKey("cartContext.clearFailed");
      throw err;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value: CartContextType = {
    items,
    itemCount,
    total,
    loading,
    error: errorKey ? t(errorKey) : null,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
