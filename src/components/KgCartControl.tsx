import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";

export default function KgCartControl({ product, cartItem, addToCart, removeFromCart }: any) {
  const minGrams = 10;
  const maxGrams = product.weight ?? 10000;
  const grams = cartItem?.grams ?? 0;

  const handleMinus = () => {
    if (grams > minGrams) {
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
        grams: grams - 10,
      });
    } else if (grams === minGrams) {
      // Set grams to 0 (remove from cart)
      if (removeFromCart) {
        removeFromCart(product._id);
      } else {
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

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex items-center bg-gray-100 rounded-lg shadow-inner px-1 py-1">
        <button
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-l-lg text-lg font-bold transition"
          onClick={handleMinus}
          type="button"
          disabled={grams === 0}
        >-</button>
        <input
          type="number"
          min={0}
          max={maxGrams}
          step={10}
          value={grams === 0 ? "" : grams}
          onChange={handleInput}
          className="w-16 border-0 bg-transparent text-center font-semibold focus:outline-none no-spinner"
          placeholder="0"
        />
        <span className="mx-1 text-gray-500 font-medium">g</span>
        <button
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-r-lg text-lg font-bold transition"
          onClick={handlePlus}
          type="button"
          disabled={grams >= maxGrams}
        >+</button>
      </div>
    </div>
  );
}