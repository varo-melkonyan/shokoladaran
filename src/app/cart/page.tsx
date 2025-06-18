"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [form, setForm] = useState({
    address: "",
    name: "",
    phone: "",
  });

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handlePayOnline = async () => {
  // Send cart and form data to your backend API to create a Stripe Checkout session
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart, form, deliveryType }),
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url; // Redirect to Stripe Checkout
  } else {
    alert("Payment error. Please try again.");
  }
};
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-chocolate mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="space-y-6">
          {cart.map((item, idx) => (
            <div key={item.id + "-" + idx} className="flex items-center gap-4 border-b pb-4">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
              )}
              <div className="flex-1">
                <div className="font-semibold text-lg">{item.name}</div>
                {item.price && (
                  <div className="text-gray-700 mb-1">
                    Price: {item.price} AMD &times; {item.quantity} ={" "}
                    <span className="font-bold">{item.price * item.quantity} AMD</span>
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-xl mt-6">
            Total: {total} AMD
          </div>
          {!showCheckout ? (
            <button
              onClick={() => setShowCheckout(true)}
              className="block ml-auto bg-chocolate text-white px-6 py-2 rounded text-base mt-4"
            >
              Checkout
            </button>
          ) : (
            <section className="bg-gray-50 rounded-lg p-6 mt-8">
              <h2 className="text-xl font-bold mb-4">Contact & Delivery</h2>
              <div className="mb-4">
                <label className="font-semibold mr-4">Delivery Method:</label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="delivery"
                    checked={deliveryType === "delivery"}
                    onChange={() => setDeliveryType("delivery")}
                    className="mr-1"
                  />
                  Delivery
                </label>
                <label>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    checked={deliveryType === "pickup"}
                    onChange={() => setDeliveryType("pickup")}
                    className="mr-1"
                  />
                  Pick up from branch
                </label>
              </div>
              {deliveryType === "delivery" && (
                <>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleInput}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Delivery address"
                    />
                  </div>
                </>
              )}
              <div className="mb-4">
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInput}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Your name"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleInput}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Your phone"
                />
              </div>
              <button
  onClick={handlePayOnline}
  className="block ml-auto bg-green-600 text-white px-6 py-2 rounded text-base mt-4"
>
  Pay Online
</button>
            </section>
          )}
        </div>
      )}
    </main>
  );
}