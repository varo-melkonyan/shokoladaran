"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

export default function ProductClient({
  product,
  recommendations,
}: {
  product: any;
  recommendations: any[];
}) {
  const { addToCart, removeFromCart, cart } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  const { t } = useTranslation();

  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.png"];

  // Find this product in the cart
  const cartItem = cart.find((item) => item._id === product._id);

  return (
    <div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl p-8 ">
        {/* Left: Product Images */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 flex flex-col items-center">
            <div className="relative w-full flex flex-col items-center">
              <img
                src={images[imgIdx]}
                alt={product.name_en}
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
              <div className="flex gap-2 mt-4">
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
        </div>
        {/* Right: Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-chocolate mb-2">{
              i18n.language === "hy"
                ? product.name_hy
                : i18n.language === "ru"
                ? product.name_ru
                : product.name_en
            }</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-end gap-3 mb-4">
              {product.discount ? (
                <>
                  <span className="line-through text-gray-400 text-lg">{product.price} {t("amd")}</span>
                  <span className="text-red-600 font-bold text-2xl">{product.discount} {t("amd")}</span>
                </>
              ) : (
                <span className="text-chocolate font-bold text-2xl">{product.price} {t("amd")}</span>
              )}
            </div>
            <div className="flex gap-6 mb-4 items-start">
              <div className="flex flex-col gap-2">
                <div>
                  <span className="font-semibold text-chocolate">{t("brand")}:</span>{" "}
                  <span className="text-gray-700">{product.brand}</span>
                </div>
                <div>
                  <span className="font-semibold text-chocolate">{t("collection")}:</span>{" "}
                  <span className="text-gray-700">{product.collectionType}</span>
                </div>
              </div>
              {/* Product Details Card - visually separated */}
              <div className="bg-gray-50 rounded-xl shadow-md p-4 min-w-[220px] ml-8">
                <h3 className="text-lg font-bold text-chocolate mb-2">{t("details")}</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>
                    <span className="font-semibold text-chocolate">{t("quantity_type")}:</span>{" "}
                    <span>{product.quantityType === "kg" ? t("weight_kg") : t("piece")}</span>
                  </li>
                  {product.ingredients && product.ingredients.length > 0 && (
                    <li>
                      <span className="font-semibold text-chocolate">{t("ingredients")}:</span>{" "}
                      <span>{product.ingredients.join(", ")}</span>
                    </li>
                  )}
                  {product.shelfLife && (
                    <li>
                      <span className="font-semibold text-chocolate">{t("shelf_life")}:</span>{" "}
                      <span>{product.shelfLife}</span>
                    </li>
                  )}
                  {product.nutritionFacts && (
                    <li>
                      <span className="font-semibold text-chocolate">{t("nutrition_facts")}:</span>
                      <ul className="ml-4 space-y-1">
                        {product.nutritionFacts.energy && (
                          <li>
                            <span className="font-semibold">{t("energy")}:</span> {product.nutritionFacts.energy}
                          </li>
                        )}
                        {product.nutritionFacts.fat && (
                          <li>
                            <span className="font-semibold">{t("fat")}:</span> {product.nutritionFacts.fat}
                          </li>
                        )}
                        {product.nutritionFacts.carbohydrates && (
                          <li>
                            <span className="font-semibold">{t("carbohydrates")}:</span> {product.nutritionFacts.carbohydrates}
                          </li>
                        )}
                        {product.nutritionFacts.protein && (
                          <li>
                            <span className="font-semibold">{t("protein")}:</span> {product.nutritionFacts.protein}
                          </li>
                        )}
                      </ul>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            {/* Cart Control */}
            <div className="mt-6">
              {product.quantityType === "kg" ? (
                <KgCartControl
                  product={product}
                  cartItem={cartItem}
                  addToCart={addToCart}
                />
              ) : (
                <PieceCartControl
                  product={product}
                  cartItem={cartItem}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Recommendations */}
      <div className="max-w-7xl mx-auto mt-16 p-8">
        <h2 className="text-2xl font-bold mb-6 text-chocolate">{t("recommended_products")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {recommendations.map((rec) => (
            <div key={rec._id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <Link href={`/product/${rec._id}`}>
                <img
                  src={rec.images?.[0]}
                  alt={rec.name}
                  className="w-full h-40 object-contain mb-2 rounded cursor-pointer"
                />
              </Link>
              <div className="font-semibold text-chocolate">{rec.name}</div>
              <div className="text-red-600 font-bold">
                {rec.discount ? `${rec.discount} ${t("amd")}` : `${rec.price} ${t("amd")}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}