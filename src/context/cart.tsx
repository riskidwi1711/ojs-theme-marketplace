"use client";
import * as React from "react";
import { useAuth } from "./auth";
import { addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, getCart as apiGetCart, clearCart as apiClearCart } from "@/api/cart";
import type { CartItem } from "@/types/cart";

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  count: number;
  totalIDR: number;
}

const CartContext = React.createContext<CartContextType | null>(null);

const STORAGE_KEY = "openthemes_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [initialized, setInitialized] = React.useState(false);
  const { token, loading: authLoading } = useAuth();
  const prevTokenRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (initialized || authLoading) return;

    const initCart = async () => {
      try {
        if (token) {
          const backendItems = await apiGetCart();
          setItems(backendItems);
          localStorage.removeItem(STORAGE_KEY);
        } else {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              setItems(parsed);
            }
          }
        }
      } catch {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setItems(parsed);
        }
      } finally {
        setInitialized(true);
      }
    };

    initCart();
  }, [token, authLoading, initialized]);

  React.useEffect(() => {
    if (token && prevTokenRef.current !== token && initialized) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const localItems = JSON.parse(stored);
        if (Array.isArray(localItems) && localItems.length > 0) {
          localItems.forEach((item) => {
            apiAddToCart(item).catch(() => {});
          });
          localStorage.removeItem(STORAGE_KEY);
          apiGetCart().then(setItems).catch(() => {});
        }
      }
    }
    prevTokenRef.current = token;
  }, [token, initialized]);

  React.useEffect(() => {
    if (!token && initialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore
      }
    }
  }, [items, token, initialized]);

  const addItem = React.useCallback(async (item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });

    if (token) {
      try {
        await apiAddToCart(item);
      } catch {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      }
    }
  }, [token]);

  const removeItem = React.useCallback(async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));

    if (token) {
      try {
        await apiRemoveFromCart(id);
      } catch {
        if (token) {
          apiGetCart().then(setItems).catch(() => {});
        }
      }
    }
  }, [token]);

  const clearCart = React.useCallback(async () => {
    setItems([]);

    if (token) {
      try {
        await apiClearCart();
      } catch {
        // ignore
      }
    }
  }, [token]);

  const count = items.length;
  const totalIDR = items.reduce((sum, i) => sum + i.priceIDR, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, count, totalIDR }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartProvider;
