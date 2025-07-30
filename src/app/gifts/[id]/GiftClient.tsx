"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import PieceCartControl from "@/components/PieceCartControl";
import KgCartControl from "@/components/KgCartControl";

export default function GiftClient({ gift }: { gift: any }) {
  const { addToCart, removeFromCart, cart } = useCart();
  const [imgIdx, setImgIdx] = useState(0);

  const images = gift.images && gift.images.length > 0 ? gift.images : ["/placeholder.png"];
  const cartItem = cart.find((item) => item._id === gift._id);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg p-8">
        {/* Left: Images */}
        <div>
          <div className="relative flex flex-col items-center">
            <img
              src={images[imgIdx]}
              alt={gift.name}
              className="w-full h-80 object-contain rounded-xl"
            />
            {images.length > 1 && (
              <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center w-full px-2 pointer-events-none">
                <button
                  type="button"
                  className="pointer-events-auto bg-white/80 hover:bg-chocolate hover:text-white rounded-full p-2 shadow"
                  onClick={() => setImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  aria-label="Previous image"
                >
                  &#8592;
                </button>
                <button
                  type="button"
                  className="pointer-events-auto bg-white/80 hover:bg-chocolate hover:text-white rounded-full p-2 shadow"
                  onClick={() => setImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  aria-label="Next image"
                >
                  &#8594;
                </button>
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 justify-center">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border ${imgIdx === idx ? "border-chocolate" : "border-gray-200"}`}
                  onClick={() => setImgIdx(idx)}
                />
              ))}
            </div>
          )}
        </div>
        {/* Right: Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-chocolate mb-2">{gift.name}</h1>
            <div className="flex items-end gap-3 mb-4">
              {gift.discount ? (
                <>
                  <span className="line-through text-gray-400 text-lg">{gift.price} AMD</span>
                  <span className="text-red-600 font-bold text-2xl">{gift.discount} AMD</span>
                </>
              ) : (
                <span className="text-chocolate font-bold text-2xl">{gift.price} AMD</span>
              )}
            </div>
            <div className="mb-4">
              <span className="font-semibold text-chocolate">Brand:</span>{" "}
              <span className="text-gray-700">{gift.brand}</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-chocolate">Collection:</span>{" "}
              <span className="text-gray-700">{gift.collectionType}</span>
            </div>
            {/* Add more gift details here if needed */}
          </div>
          {/* Cart Control */}
          <div className="mt-6">
            {gift.quantityType === "kg" ? (
              <KgCartControl
                product={gift}
                cartItem={cartItem}
                addToCart={addToCart}
              />
            ) : (
              <PieceCartControl
                product={gift}
                cartItem={cartItem}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}