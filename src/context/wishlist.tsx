"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth";
import http from "@/api/http";
import { WishlistItem } from "@/types";

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadWishlist = async () => {
      if (user && token) {
        try {
          const res = await http.get("/api/v1/wishlist");
          setItems(res.data.items || []);
        } catch {
          loadFromLocal();
        }
      } else {
        loadFromLocal();
      }
      setInitialized(true);
    };

    const loadFromLocal = () => {
      const saved = localStorage.getItem("wishlist");
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    };

    loadWishlist();
  }, [user, token]);

  useEffect(() => {
    if (initialized && !user) {
      localStorage.setItem("wishlist", JSON.stringify(items));
    }
  }, [items, user, initialized]);

  const addToWishlist = async (item: WishlistItem) => {
    const exists = items.find((i) => i.id === item.id);
    if (exists) return;

    const newItems = [...items, item];
    setItems(newItems);

    if (user && token) {
      try {
        await http.post("/api/v1/wishlist", item);
      } catch {
        // ignore
      }
    }
  };

  const removeFromWishlist = async (id: string) => {
    const newItems = items.filter((i) => i.id !== id);
    setItems(newItems);

    if (user && token) {
      try {
        await http.delete(`/api/v1/wishlist/${id}`);
      } catch {
        // ignore
      }
    }
  };

  const isInWishlist = (id: string) => {
    return items.some((i) => i.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        count: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
