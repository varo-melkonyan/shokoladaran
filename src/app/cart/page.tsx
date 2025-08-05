"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

export default function CartPage() {
  const { t } = useTranslation();
  const { cart, addToCart, removeFromCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [form, setForm] = useState({
    address: "",
    name: "",
    phone: "",
  });

  // Calculate total for both grams and quantity products
  const total = cart.reduce((sum, item) => {
    if (typeof item.grams === "number") {
      const unitPrice = item.discount ?? item.price ?? 0;
      return sum + Math.round((unitPrice / 100) * item.grams);
    }
    return sum + ((item.discount ?? item.price ?? 0) * item.quantity);
  }, 0);

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

  // Plus/Minus handlers
  const handleIncrease = (item: any) => {
    if (typeof item.grams === "number") {
      addToCart({ ...item, grams: (item.grams ?? 0) + 10 });
    } else {
      addToCart({ ...item, quantity: 1 });
    }
  };
  const handleDecrease = (item: any) => {
    if (typeof item.grams === "number") {
      addToCart({ ...item, grams: Math.max((item.grams ?? 0) - 10, 0) });
    } else {
      addToCart({ ...item, quantity: -1 });
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-chocolate mb-8">{t("your_cart")}</h1>
      {cart.length === 0 ? (
        <div className="text-gray-500">{t("empty_cart")}</div>
      ) : (
        <div className="space-y-6">
          {cart.map((item, idx) => {
            // Calculate item price
            let itemPrice = 0;
            if (typeof item.grams === "number") {
              itemPrice = Math.round(((item.discount ?? item.price ?? 0) / 100) * item.grams);
            } else {
              itemPrice = (item.discount ?? item.price ?? 0) * item.quantity;
            }
            return (
              <div key={item._id + "-" + idx} className="flex items-center gap-4 border-b pb-4">
                {item.images && (
                  <img src={item.images[0]} alt={item.name_en} className="w-24 h-24 object-cover rounded" />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-lg">{
                    i18n.language === "hy"
                      ? item.name_hy
                      : i18n.language === "ru"
                      ? item.name_ru
                      : item.name_en
                  }</div>
                  {/* Show readyAfter for pre-order items */}
                  {item.status === "pre_order" && (
                    <div className="text-orange-600 text-sm mt-1">
                      {t("pre_order")}: {t("will_be_ready")} {item.readyAfter ? `${t("in")} ${item.readyAfter}` : `${t("soon")}`}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {typeof item.grams === "number"
                      ? `Grams: ${item.grams}g`
                      : `Qty: ${item.quantity}`}
                  </div>
                  <div className="flex gap-2 mt-2 items-center">
                    {/* Minus Button */}
                    <button
                      onClick={() => handleDecrease(item)}
                      className="px-2 py-1 bg-gray-200 rounded text-lg font-bold"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    {/* Quantity/Grams */}
                    <span className="min-w-[40px] text-center">
                      {typeof item.grams === "number"
                        ? `${item.grams}g`
                        : item.quantity}
                    </span>
                    {/* Plus Button */}
                    <button
                      onClick={() => handleIncrease(item)}
                      className="px-2 py-1 bg-gray-200 rounded text-lg font-bold"
                      aria-label="Increase"
                    >
                      +
                    </button>
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs ml-2"
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
                {item.discount ? (
                  <div className="text-right">
                    <div className="text-gray-700 mb-1 line-through">
                      {typeof item.grams === "number"
                        ? Math.round(((item.price ?? 0) / 100) * item.grams) + " " + t("amd")
                        : (item.price ?? 0) * item.quantity + " " + t("amd")}
                    </div>
                    <div className="text-chocolate font-bold">
                      {itemPrice} {t("amd")}
                    </div>
                  </div>
                ) : (
                  <div className="text-right font-bold text-xl mt-6">
                    {itemPrice} {t("amd")}
                  </div>
                )}
              </div>
            );
          })}
          <div className="text-right font-bold text-xl mt-6">
            {t("total")}: {total} {t("amd")}
          </div>
          <section className="bg-gray-50 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">{t("contact_delivery")}</h2>
            <div className="mb-4">
              <label className="font-semibold mr-4">{t("delivery_method")}:</label>
              <label className="mr-4">
                <input
                  type="radio"
                  name="deliveryType"
                  value="delivery"
                  checked={deliveryType === "delivery"}
                  onChange={() => setDeliveryType("delivery")}
                  className="mr-1"
                />
                {t("delivery")}
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
                {t("pick_up_from_branch")}
              </label>
            </div>
            {deliveryType === "delivery" && (
              <>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">{t("address")}</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleInput}
                    className="w-full border rounded px-3 py-2"
                    placeholder={t("address")}
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block font-semibold mb-1">{t("full_name")}</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInput}
                className="w-full border rounded px-3 py-2"
                placeholder={t("full_name")}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">{t("phone_number")}</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleInput}
                className="w-full border rounded px-3 py-2"
                placeholder={t("phone_number")}
              />
            </div>
            <button
              onClick={handlePayOnline}
              className="block ml-auto bg-green-600 text-white px-6 py-2 rounded text-base mt-4"
            >
              {t("pay_online")}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}