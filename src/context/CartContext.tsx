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
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number; grams?: number }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void; // <-- Add this line
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, "quantity"> & { quantity?: number; grams?: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);

      // If grams is provided, handle grams-based products
      if (typeof item.grams === "number") {
        // Remove from cart if grams is 0
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
        return [...prev, { ...item, grams: item.grams, quantity: 1 }];
      }

      // Otherwise, handle quantity-based products (pieces)
      const addQty = item.quantity ?? 1;
      if (existing) {
        const newQty = existing.quantity + addQty;
        // Remove from cart if quantity is 0 or less
        if (newQty <= 0) {
          return prev.filter((i) => i._id !== item._id);
        }
        return prev.map((i) =>
          i._id === item._id
            ? { ...i, quantity: newQty, grams: undefined }
            : i
        );
      }
      // Only add if quantity is positive
      if (addQty > 0) {
        return [...prev, { ...item, quantity: addQty, grams: undefined }];
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