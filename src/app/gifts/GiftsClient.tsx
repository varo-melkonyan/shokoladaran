"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import PieceCartControl from "@/components/PieceCartControl";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Gift } from "@/types/gifts";

type Brand = {
  brand_en: string;
  brand_hy: string;
  brand_ru: string;
};

export default function GiftsClient() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const { addToCart, removeFromCart, cart } = useCart();
  const { t } = useTranslation();

  // Fetch gifts and brands
  useEffect(() => {
    fetch("/api/admin/gifts")
      .then((res) => res.json())
      .then((data) => setGifts(data));
    fetch("/api/admin/brands")
      .then((res) => res.json())
      .then((data) =>
        setBrands(
          data.map((b: any) => ({
            brand_en: b.name_en,
            brand_hy: b.name_hy,
            brand_ru: b.name_ru,
          }))
        )
      );
  }, []);

  // Filter and sort state
  const [brandFilter, setBrandFilter] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");

  // Filter and sort logic
  let filtered = gifts.filter((g: Gift) => {
    if (!brandFilter) return true;
    if (g.brand && typeof g.brand === "object") {
      return (g.brand as Brand).brand_en === brandFilter;
    }
    if (typeof g.brand === "string") {
      return g.brand === brandFilter;
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

  // Helper to get brand name in current language
  const getBrandName = (brand: string | Brand | undefined) => {
    if (!brand) return "";
    if (typeof brand === "object") {
      return i18n.language === "hy"
        ? brand.brand_hy
        : i18n.language === "ru"
        ? brand.brand_ru
        : brand.brand_en;
    }
    // brand is string, look up in brands array
    const found = brands.find((b: Brand) => b.brand_en === brand);
    if (found) {
      return i18n.language === "hy"
        ? found.brand_hy
        : i18n.language === "ru"
        ? found.brand_ru
        : found.brand_en;
    }
    return brand;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <h1 className="text-4xl font-bold text-chocolate mb-10 text-center">{t("gifts")}</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Brand filter */}
        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
        >
          <option value="">{t("all_brands")}</option>
          {brands.map(b => (
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
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="name-asc">{t("sort_options.name_asc")}</option>
          <option value="name-desc">{t("sort_options.name_desc")}</option>
          <option value="price-asc">{t("sort_options.price_low_to_high")}</option>
          <option value="price-desc">{t("sort_options.price_high_to_low")}</option>
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
        {filtered.map((item) => {
          const cartItem = cart.find((ci: any) => ci._id === item._id);

          return (
            <div key={item._id} className="group bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition relative flex flex-col">
              {/* Image and badges */}
              <div className="relative w-full aspect-[3/4]">
                <Link href={item.link || `/gifts/${item._id}`}>
                  <img src={item.images[0]} alt={item.name_en} className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                </Link>
                {item.discount && (
                  <span
                    className="
                      absolute top-3 left-3 bg-chocolate text-white text-xs font-bold px-2 py-1 rounded z-10
                      opacity-100
                      sm:opacity-0 sm:group-hover:opacity-100
                      transition
                    "
                  >
                    -{Math.round(100 - (item.discount / item.price) * 100)}%
                  </span>
                )}
                {/* Brand badge */}
                {item.brand && (
                  <span className="
                    absolute top-3 right-3 bg-white/80 text-chocolate text-xs font-semibold px-2 py-1 rounded z-10
                    opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition
                  ">
                    {getBrandName(item.brand)}
                  </span>
                )}
                {/* Price badge */}
                <span className="absolute bottom-3 left-3 bg-white/90 text-chocolate text-base font-bold px-3 py-1 rounded shadow z-10">
                  {item.discount ? (
                    <>
                      <span className="line-through text-gray-400 text-sm mr-2">{item.price} {t("amd")}</span>
                      <span className="text-chocolate font-bold">{item.discount} {t("amd")}</span>
                    </>
                  ) : (
                    <span className="text-chocolate font-bold">{item.price} {t("amd")}</span>
                  )}
                </span>
              </div>
              <div className="p-2 sm:p-4 flex flex-col items-start flex-1">
                <h2 className="text-xs sm:text-base font-semibold mb-1 line-clamp-2 min-h-[28px] sm:min-h-[40px]">
                  {
                    i18n.language === "hy"
                      ? item.name_hy
                      : i18n.language === "ru"
                      ? item.name_ru
                      : item.name_en
                  }
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
                      product={item}
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