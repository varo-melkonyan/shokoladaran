"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import PieceCartControl from "@/components/PieceCartControl";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

type Special = {
  _id: string;
  name_en: string;
  name_hy: string;
  name_ru: string;
  images: string[];
  price: number;
  discount?: number;
  brand?: string;
  collectionType?: string;
  link?: string;
  status?: string;
  weight?: number;
};

export default function SpecialsClient() {
  const [specials, setSpecials] = useState<Special[]>([]);
  const { addToCart, removeFromCart, cart } = useCart();
  const { t } = useTranslation();


  useEffect(() => {
    fetch("/api/admin/special")
      .then((res) => res.json())
      .then((data) => setSpecials(data));
  }, []);

  const brands = useMemo(
    () => Array.from(new Set(specials.map((g) => g.brand).filter(Boolean))),
    [specials]
  );

  const [collectionFilter, setCollectionFilter] = useState("");

  // Filter and sort state
  const [specialFilter, setSpecialFilter] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");

  // Filter and sort logic
  let filtered = specials.filter(
    g => (!specialFilter || g.brand === specialFilter) &&
         (!collectionFilter || g.collectionType === collectionFilter)
  );

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => (a.discount ?? a.price) - (b.discount ?? b.price));
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => (b.discount ?? b.price) - (a.discount ?? a.price));
  if (sortBy === "name-asc") filtered = [...filtered].sort((a, b) =>
    (a.name_en || "").localeCompare(b.name_en || "")
  );
  if (sortBy === "name-desc") filtered = [...filtered].sort((a, b) =>
    (b.name_en || "").localeCompare(a.name_en || "")
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <h1 className="text-4xl font-bold text-chocolate mb-10 text-center">{t("special")}</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          className="border p-2 rounded"
          value={specialFilter}
          onChange={e => setSpecialFilter(e.target.value)}
        >
          <option value="">{t("all_specials")}</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="name-asc">{t("sort_options.name_asc")}</option>
          <option value="name-desc">{t("sort_options.name_desc")}</option>
          <option value="price-asc">{t("sort_options.price_low_to_high")}</option>
          <option value="price-desc">{t("sort_options.price_high_to_low")}</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {filtered.map((item) => {
          const cartItem = cart.find((ci: any) => ci._id === item._id);

          return (
            <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition">
              <Link href={item.link || `/special/${item._id}`}>
                <img src={item.images[0]} alt={item.name_en} className="w-full h-56 object-cover cursor-pointer" />
              </Link>
              <div className="p-4">
                <h2 className="font-semibold text-chocolate text-base sm:text-lg md:text-xl lg:text-2xl">
                  {
                    i18n.language === "hy"
                      ? item.name_hy
                      : i18n.language === "ru"
                      ? item.name_ru
                      : item.name_en
                  }
                </h2>
                <div className="mt-2 mb-3">
                  {item.discount ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">{item.price} {t("amd")}</span>
                      <span className="text-chocolate font-bold">{item.discount} {t("amd")}</span>
                    </>
                  ) : (
                    <span className="text-chocolate font-bold">{item.price} {t("amd")}</span>
                  )}
                </div>
                {/* Cart controls */}
                <div className="mt-4">
                    <PieceCartControl
                      product={item}
                      cartItem={cartItem}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                    />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-8">No specials found.</div>
      )}
    </div>
  );
}