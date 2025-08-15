import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function KgCartControl({ product, cartItem, addToCart, removeFromCart }: any) {
  const { t } = useTranslation();
  const minGrams = 10;
  const maxGrams = Number(product.weight) || 10000;
  const grams = Number(cartItem?.grams ?? 0);

  const handleMinus = () => {
    if (grams > minGrams) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        images: product.images,
        status: product.status || "in_stock",
        readyAfter: product.readyAfter,
        grams: grams - 10,
      });
    } else if (grams === minGrams) {
      // Set grams to 0 (remove from cart)
      if (removeFromCart) {
        removeFromCart(product._id);
      } else {
        addToCart({
          _id: product._id,
          name: product.name,
          price: product.price,
          discount: product.discount,
          images: product.images,
          status: product.status || "in_stock",
          readyAfter: product.readyAfter,
          grams: 0,
        });
      }
    }
    // If grams is 0, do nothing (button is disabled)
  };

  const handlePlus = () => {
    if (grams < maxGrams) {
      const newGrams = grams === 0 ? minGrams : Math.min(grams + 10, maxGrams);
      addToCart({
        _id: product._id,
        name_en: product.name_en,
        name_hy: product.name_hy,
        name_ru: product.name_ru,
        price: product.price,
        discount: product.discount,
        images: product.images,
        status: product.status || "in_stock",
        readyAfter: product.readyAfter,
        grams: newGrams,
      });
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (isNaN(value)) value = minGrams;
    value = Math.max(0, Math.min(maxGrams, value));
    addToCart({
      _id: product._id,
      name_en: product.name_en,
      name_hy: product.name_hy,
      name_ru: product.name_ru,
      price: product.price,
      discount: product.discount,
      images: product.images,
      status: product.status || "in_stock",
      readyAfter: product.readyAfter,
      grams: value,
    });
  };

  return grams === 0 ? (
    <button
      className="add-btn flex items-center gap-2 px-4 py-2 font-semibold bg-chocolate text-chocolate hover:bg-chocolate-dark transition"
      onClick={handlePlus}
      type="button"
    >
      <FaShoppingCart className="text-lg text-chocolate" />
      {t("add")}
    </button>
  ) : (
    <div className="qty-controlKg border border-chocolate rounded-[6px] flex gap-2 items-center px-1 py-1 bg-chocolate">
      <button
        className="add-btn text-xl px-2 rounded-[6px] hover:bg-chocolate/10 hover:text-white transition text-chocolate"
        onClick={handleMinus}
        type="button"
        aria-label="Decrease"
        disabled={grams === 0}
      >-</button>
      <div className="flex items-center">
        <input
          type="number"
          min={minGrams}
          max={maxGrams}
          step={10}
          value={typeof grams === "number" && !isNaN(grams) && grams > 0 ? grams : ''}
          onChange={handleInput}
          className="w-13 border-0 bg-transparent text-center font-semibold focus:outline-none no-spinner text-chocolate text-base"
          placeholder="0"
        />
      </div>
      <button
        className="add-btn text-xl px-2 rounded-[6px] hover:bg-chocolate/10 hover:text-white transition text-chocolate"
        onClick={handlePlus}
        type="button"
        aria-label="Increase"
        disabled={grams >= maxGrams}
      >+</button>
    </div>
  );
}