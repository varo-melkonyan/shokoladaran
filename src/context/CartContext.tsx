"use client";
import { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  _id: string;
  name: string;
  slug?: string;
  images?: string[];
  price?: number;
  status: string;
  readyAfter?: string;
  discount?: number;
  quantity: number;
  grams?: number;
  type?: "product" | "gift" | "special";
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number; grams?: number }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCart(parsed);
      } catch {
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    item: (Omit<CartItem, "quantity"> & { quantity?: number; grams?: number; image?: string })
  ) => {
    const normalizedItem = {
      ...item,
      images: Array.isArray(item.images)
        ? item.images
        : item.image
          ? [item.image]
          : [],
    };

    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);

      // If grams is provided, handle grams-based products
      if (typeof item.grams === "number") {
        if (item.grams === 0) {
          return prev.filter((i) => i._id !== item._id);
        }
        if (existing) {
          return prev.map((i) =>
            i._id === item._id
              ? { ...i, grams: item.grams, quantity: 1 }
              : i
          );
        }
        return [...prev, { ...normalizedItem, grams: item.grams, quantity: 1 }];
      }

      // Otherwise, handle quantity-based products (pieces)
      const addQty = item.quantity ?? 1;
      if (existing) {
        const newQty = existing.quantity + addQty;
        if (newQty <= 0) {
          return prev.filter((i) => i._id !== item._id);
        }
        return prev.map((i) =>
          i._id === item._id
            ? { ...i, quantity: newQty, grams: undefined }
            : i
        );
      }
      if (addQty > 0) {
        return [...prev, { ...normalizedItem, quantity: addQty, grams: undefined }];
      }
      return prev;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}