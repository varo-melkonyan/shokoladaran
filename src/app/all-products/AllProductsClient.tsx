"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";
import i18n from "@/i18n";

export default function AllProductsClient({ products }: { products: any[] }) {
  const [brandFilter, setBrandFilter] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [brands, setBrands] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const { t } = useTranslation();
  const { addToCart, removeFromCart, cart } = useCart();
  
  useEffect(() => {
      Promise.all([
        fetch("/api/admin/brands").then((res) => res.json()),
        fetch("/api/admin/collection-types").then((res) => res.json()),
      ]).then(([brandsRaw, collectionsRaw]) => {
        setBrands(
          brandsRaw.map((b: any) => ({
            value: b.name_en,
            en: b.name_en,
            hy: b.name_hy,
            ru: b.name_ru,
          }))
        );
        setCollections(
          collectionsRaw.map((c: any) => ({
            value: c.name_en,
            en: c.name_en,
            hy: c.name_hy,
            ru: c.name_ru,
          }))
        );
      });
    }, []);

  let filtered = products.filter(
    p =>
      (!brandFilter ||
        (p.brand && typeof p.brand === "object"
          ? p.brand.name_en === brandFilter
          : p.brand === brandFilter)) &&
      (!collectionFilter ||
        (p.collectionType && typeof p.collectionType === "object"
          ? p.collectionType.name_en === collectionFilter
          : p.collectionType === collectionFilter))
          
  );
  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "name-asc") filtered = [...filtered].sort((a, b) =>
    (a.name_en || "").localeCompare(b.name_en || "")
  );
  if (sortBy === "name-desc") filtered = [...filtered].sort((a, b) =>
    (b.name_en || "").localeCompare(a.name_en || "")
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-chocolate">{t("product_types.all_products")}</h1>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
        >
          <option value="">{t("all_brands")}</option>
          {brands.map(b => (
            <option key={b.value} value={b.value}>
              {i18n.language === "hy"
                ? b.hy
                : i18n.language === "ru"
                ? b.ru
                : b.en}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={collectionFilter}
          onChange={e => setCollectionFilter(e.target.value)}
        >
          <option value="">{t("all_collections")}</option>
          {collections.map(c => (
            <option key={c.value} value={c.value}>
              {i18n.language === "hy"
                ? c.hy
                : i18n.language === "ru"
                ? c.ru
                : c.en}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="name-asc">{t("sort_options.name_asc")}</option>
          <option value="name-desc">{t("sort_options.name_desc")}</option>
          <option value="price-asc">{t("sort_options.price_low_to_high")}</option>
          <option value="price-desc">{t("sort_options.price_high_to_low")}</option>
        </select>
      </div>
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
        {filtered
          .filter(item => item.quantityType !== "kg" || typeof item.weight !== "undefined")
          .map((product) => {

            return (
              <div
                key={product._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition relative flex flex-col"
              >
                {/* Full image as card background */}
                <div className="relative w-full aspect-[3/4]">
                  <a href={`/product/${product._id}`} className="block w-full h-full">
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name_en}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </a>
                  {product.discount && (
                    <span
                      className="
                        absolute top-3 left-3 bg-chocolate text-white text-xs font-bold px-2 py-1 rounded z-10
                        opacity-100
                        sm:opacity-0 sm:group-hover:opacity-100
                        transition
                      "
                    >
                      -{Math.round(100 - (product.discount / product.price) * 100)}%
                    </span>
                  )}

                  <span
                    className="
                      absolute top-3 right-3 bg-white/80 text-chocolate text-xs font-semibold px-2 py-1 rounded z-10
                      opacity-100
                      sm:opacity-0 sm:group-hover:opacity-100
                      transition
                    "
                  >
                    {(() => {
                      if (product.brand && typeof product.brand === "object") {
                        return i18n.language === "hy"
                          ? product.brand.name_hy
                          : i18n.language === "ru"
                          ? product.brand.name_ru
                          : product.brand.name_en;
                      }
                      // If brand is a string, look up in brands array by English name
                      const found = brands.find(b => b.en === product.brand || b.value === product.brand);
                      if (found) {
                        return i18n.language === "hy"
                          ? found.hy
                          : i18n.language === "ru"
                          ? found.ru
                          : found.en;
                      }
                      return product.brand || "";
                    })()}
                  </span>
                  {/* Price badge */}
                  <span className="absolute bottom-3 left-3 bg-white/90 text-chocolate text-base font-bold px-3 py-1 rounded shadow z-10">
                    {product.discount ? (
                      <>
                        <span className="line-through text-gray-400 text-sm mr-2">
                          {product.price} {t("amd")}
                        </span>
                        <span className="text-chocolate font-bold">
                          {product.discount} {t("amd")}
                        </span>
                      </>
                    ) : (
                      <span className="text-chocolate font-bold">
                        {product.price} {t("amd")}
                      </span>
                    )}
                  </span>
                </div>

                {/* Product info always visible below the image */}
                <div className="p-2 sm:p-4 flex flex-col items-start">
                  <h2 className="text-xs sm:text-base font-semibold mb-1 line-clamp-2 min-h-[28px] sm:min-h-[40px]">
                    {i18n.language === "hy"
                      ? product.name_hy
                      : i18n.language === "ru"
                      ? product.name_ru
                      : product.name_en}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 w-full justify-end">
                    <div className="mt-3 self-end pointer-events-auto opacity-100">
                      {/* Cart controls */}
                      {product.quantityType === "kg" ? (
                        <KgCartControl
                          product={product}
                          cartItem={cart.find((item) => item._id === product._id)}
                          addToCart={addToCart}
                        />
                      ) : (
                        <PieceCartControl
                          product={product}
                          cartItem={cart.find((item) => item._id === product._id)}
                          addToCart={addToCart}
                          removeFromCart={removeFromCart}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-8">{t("no_products_found")}</div>
      )}
    </div>
  );
}