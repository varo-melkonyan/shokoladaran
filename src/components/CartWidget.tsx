"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Link from "next/link";

export default function CartWidget() {
  const { cart, removeFromCart } = useCart();
  const [open, setOpen] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-8 right-8 bg-chocolate text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50"
        title="View Cart"
      >
        🛒
        {cart.length > 0 && (
          <span className="ml-1 bg-red-500 text-xs rounded-full px-2">{cart.length}</span>
        )}
      </button>
      {open && (
        <div className="fixed bottom-28 right-8 bg-white shadow-xl rounded-lg p-6 w-80 z-50">
          <h3 className="font-bold text-lg mb-4">Your Cart</h3>
          {cart.length === 0 ? (
            <div className="text-gray-500">Cart is empty.</div>
          ) : (
            <>
              <ul className="mb-4">
                {cart.map((item, idx) => (
                  <li key={item.id + "-" + idx} className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-gray-500">x{item.quantity}</div>
                    </div>
                    <div>
                      {item.price && (
                        <span className="mr-2">{item.price * item.quantity} AMD</span>
                      )}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="font-bold mb-3">Total: {total} AMD</div>
              <Link
                href="/cart"
                className="block w-full text-center bg-chocolate text-white py-2 rounded hover:bg-brown-700 transition"
                onClick={() => setOpen(false)}
              >
                See Cart
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}