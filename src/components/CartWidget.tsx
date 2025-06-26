"use client";
import { useCart } from "@/context/CartContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function CartWidget() {
  const { cart, removeFromCart } = useCart();
  const [open, setOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  // Use discount if available, otherwise price
  const total = cart.reduce(
    (sum, item) => sum + ((item.discount ?? item.price ?? 0) * item.quantity),
    0
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* Cart button */}
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

      {/* Cart popup */}
      {open && (
        <div
          ref={cartRef}
          className="fixed bottom-28 right-8 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-5"
        >
          <h3 className="text-lg font-semibold text-chocolate mb-4">🛍️ Your Cart</h3>

          {cart.length === 0 ? (
            <div className="text-gray-500 text-sm">Cart is empty.</div>
          ) : (
            <>
              <ul className="divide-y divide-gray-100 mb-4">
                {cart.map((item, idx) => (
                  <li key={item._id + "-" + idx} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      {item.discount ? (
                        <p className="text-sm text-chocolate font-semibold">
                          <span className="line-through text-gray-400 mr-1">{item.price} ֏</span>
                          <span className="text-red-600 font-extrabold">{item.discount * item.quantity} ֏</span>
                        </p>
                      ) : (
                        <p className="text-sm text-chocolate font-semibold">
                          {item.price && (item.price * item.quantity)} ֏
                        </p>
                      )}
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-base font-bold text-chocolate">{total} ֏</span>
              </div>

              <Link
                href="/cart"
                className="block text-center bg-chocolate hover:bg-brown-700 text-white font-medium py-2 rounded-lg transition"
                onClick={() => setOpen(false)}
              >
                🛒 See Cart
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
