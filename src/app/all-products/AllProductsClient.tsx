"use client";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

type Product = {
  _id: string;
  name_en: string;
  name_hy: string;
  name_ru: string;
  price: number;
  weight: string;
  collectionType: string;
  brand: string;
  images: string[];
  status?: string;
  readyAfter?: string;
  discount?: number;
  ingredients?: string[];
  shelfLife?: string;
  nutritionFacts?: { [key: string]: string };
  stockCount?: number;
  quantityType?: string;
};

function getUnique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr)).filter(Boolean);
}

export default function AllProductsClient({ products }: { products: Product[] }) {
  const [brandFilter, setBrandFilter] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const brands = useMemo(() => getUnique(products.map(p => p.brand)), [products]);
  const collections = useMemo(() => getUnique(products.map(p => p.collectionType)), [products]);
  const { t } = useTranslation();

  let filtered = products.filter(
    p =>
      (!brandFilter || p.brand === brandFilter) &&
      (!collectionFilter || p.collectionType === collectionFilter)
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
          className="border p-2 rounded"
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
        >
          <option value="">{t("all_brands")}</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={collectionFilter}
          onChange={e => setCollectionFilter(e.target.value)}
        >
          <option value="">{t("all_collections")}</option>
          {collections.map(c => (
            <option key={c} value={c}>{c}</option>
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
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow p-4 relative">
            <div className="relative">
              <a href={`/product/${product._id}`}>
                <img
                  src={product.images?.[0]}
                  alt={product.name_en}
                  className="w-full h-40 object-cover rounded mb-4 cursor-pointer"
                />
              </a>
            </div>
            <h2 className="font-semibold text-chocolate text-base md:text-l lg:text-l">
              {
                i18n.language === "hy"
                  ? product.name_hy
                  : i18n.language === "ru"
                  ? product.name_ru
                  : product.name_en
              }
            </h2>
            <div className="mt-2">
              {product.discount ? (
                <>
                  <span className="line-through text-gray-400 mr-2">{product.price} {t("amd")}</span>
                  <span className="text-chocolate font-bold">{product.discount} {t("amd")}</span>
                </>
              ) : (
                <span className="text-chocolate font-bold">{product.price} {t("amd")}</span>
              )}
            </div>
            {product.status && (
              <div className="text-xs mt-1">
                <span
                  className={`px-2 py-1 rounded ${
                    product.status === "in_stock"
                      ? "bg-green-100 text-green-700"
                      : product.status === "pre_order"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.status === "in_stock" && "In Stock"}
                  {product.status === "pre_order" && (
                    <>
                      Pre-order
                      {product.readyAfter ? ` (Ready in ${product.readyAfter})` : ""}
                    </>
                  )}
                  {product.status === "out_of_stock" && "No Product"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-8">{t("no_products_found")}</div>
      )}
    </div>
  );
}