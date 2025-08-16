"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import PieceCartControl from "@/components/PieceCartControl";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Special } from "@/types/special";

type Brand = {
  brand_en: string;
  brand_hy: string;
  brand_ru: string;
};

export default function SpecialsClient() {
  const [specials, setSpecials] = useState<Special[]>([]);
  const { addToCart, removeFromCart, cart } = useCart();
  const { t } = useTranslation();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandFilter, setBrandFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price-asc");

  // Fetch specials and brands
  useEffect(() => {
    Promise.all([
      fetch("/api/admin/special").then((res) => res.json()),
      fetch("/api/admin/brands").then((res) => res.json()),
    ]).then(([specialsRaw, brandsRaw]) => {
      setSpecials(specialsRaw);
      setBrands(
        brandsRaw.map((b: any) => ({
          brand_en: b.name_en,
          brand_hy: b.name_hy,
          brand_ru: b.name_ru,
        }))
      );
      setLoading(false);
    });
  }, []);

  // Filter and sort logic
  let filtered = specials.filter((p) => {
    if (!brandFilter) return true;
    if (p.brand && typeof p.brand === "object" && "brand_en" in p.brand) {
      return (p.brand as Brand).brand_en === brandFilter;
    }
    if (typeof p.brand === "string") {
      return p.brand === brandFilter;
    }
    return false;
  });

  if (sortBy === "price-asc")
    filtered = [...filtered].sort(
      (a, b) => (a.discount ?? a.price) - (b.discount ?? b.price)
    );
  if (sortBy === "price-desc")
    filtered = [...filtered].sort(
      (a, b) => (b.discount ?? b.price) - (a.discount ?? a.price)
    );
  if (sortBy === "name-asc")
    filtered = [...filtered].sort((a, b) =>
      (a.name_en || "").localeCompare(b.name_en || "")
    );
  if (sortBy === "name-desc")
    filtered = [...filtered].sort((a, b) =>
      (b.name_en || "").localeCompare(a.name_en || "")
    );

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">{t("loading")}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <h1 className="text-4xl font-bold text-chocolate mb-10 text-center">
        {t("special")}
      </h1>
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Brand filter */}
        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
        >
          <option value="">{t("all_brands")}</option>
          {brands.map((b) => (
            <option key={b.brand_en} value={b.brand_en}>
              {i18n.language === "hy"
                ? b.brand_hy
                : i18n.language === "ru"
                ? b.brand_ru
                : b.brand_en}
            </option>
          ))}
        </select>
        {/* Sort filter */}
        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name-asc">{t("sort_options.name_asc")}</option>
          <option value="name-desc">{t("sort_options.name_desc")}</option>
          <option value="price-asc">{t("sort_options.price_low_to_high")}</option>
          <option value="price-desc">{t("sort_options.price_high_to_low")}</option>
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((product) => {
          const cartItem = cart.find((ci: any) => ci._id === product._id);

          // Helper to get brand in current language
          const getBrandName = () => {
            if (product.brand && typeof product.brand === "object") {
              return i18n.language === "hy"
                ? (product.brand as Brand).brand_hy
                : i18n.language === "ru"
                ? (product.brand as Brand).brand_ru
                : (product.brand as Brand).brand_en;
            }
            if (typeof product.brand === "string") {
              // Try to find in brands array for translation
              const found = brands.find((b: Brand) => b.brand_en === product.brand);
              if (found) {
                return i18n.language === "hy"
                  ? found.brand_hy
                  : i18n.language === "ru"
                  ? found.brand_ru
                  : found.brand_en;
              }
              return product.brand;
            }
            return "";
          };

          return (
            <div
              key={product._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition relative flex flex-col"
            >
              {/* Image and badges */}
              <div className="relative w-full aspect-[3/4]">
                <Link href={product.link || `/special/${product._id}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name_en}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </Link>
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
                {/* Discount badge */}
                {product.discount && (
                  <span className="
                    absolute top-3 left-3 bg-chocolate text-white text-xs font-bold px-2 py-1 rounded z-10
                    opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition
                  ">
                    -{Math.round(100 - (product.discount / product.price) * 100)}%
                  </span>
                )}
                {/* Brand badge */}
                {product.brand && (
                  <span className="
                    absolute top-3 right-3 bg-white/80 text-chocolate text-xs font-semibold px-2 py-1 rounded z-10
                    opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition
                  ">
                    {getBrandName()}
                  </span>
                )}
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
              {/* Product info and cart controls */}
              <div className="p-2 sm:p-4 flex flex-col items-start flex-1">
                <h2 className="text-xs sm:text-base font-semibold mb-1 line-clamp-2 min-h-[28px] sm:min-h-[40px]">
                  {i18n.language === "hy"
                    ? product.name_hy
                    : i18n.language === "ru"
                    ? product.name_ru
                    : product.name_en}
                </h2>
                <div className="flex items-center gap-2 mt-2 w-full justify-end">
                  <div
                    className="
                      transition
                      pointer-events-auto opacity-100
                      sm:pointer-events-none sm:group-hover:pointer-events-auto
                      sm:opacity-0 sm:group-hover:opacity-100
                    "
                  >
                    <PieceCartControl
                      product={product}
                      cartItem={cartItem}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-8">{t("no_results_found")}</div>
      )}
    </div>
  );
}