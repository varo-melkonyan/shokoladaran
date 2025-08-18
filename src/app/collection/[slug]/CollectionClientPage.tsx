"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";
import { useTranslation } from "react-i18next";

type CollectionType = {
  _id: string;
  name_en: string;
  name_hy: string;
  name_ru: string;
  type: "collection" | "children" | "dietary";
};

type Brand = {
  _id: string;
  brand_en: string;
  brand_hy: string;
  brand_ru: string;
};

const FALLBACK_IMG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'>No image</text></svg>`;
const safeImg = (src?: string) => {
  if (!src || src.trim() === "") return FALLBACK_IMG;
  if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("blob:") || src.startsWith("/")) return src;
  return `/${src}`;
};

export default function CollectionClientPage({ slug }: { slug: string }) {
  const { addToCart, removeFromCart, cart } = useCart();
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>([]);
  const [matched, setMatched] = useState<CollectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((res) => res.json()),
      fetch("/api/admin/collection-types").then((res) => res.json()),
      fetch("/api/admin/brands").then((res) => res.json()),
    ]).then(([productsRaw, collectionsRaw, brandsRaw]) => {
      const products = productsRaw.map((p: any) => ({
        _id: p._id || p.id,
        name_en: p.name_en,
        name_hy: p.name_hy,
        name_ru: p.name_ru,
        price: p.price,
        weight: p.weight,
        discount: p.discount,
        collectionType: p.collectionType,
        brand: p.brand,
        images: p.images,
        link: p.link,
        status: p.status,
        readyAfter: p.readyAfter,
        ingredients: p.ingredients,
        shelfLife: p.shelfLife,
        nutritionFacts: p.nutritionFacts,
        quantityType: p.quantityType || (p.weight ? "kg" : "piece"),
      }));

      const collections = collectionsRaw
        .map((c: any) => ({
          _id: c._id || c.id,
          name_en: c.name_en,
          name_hy: c.name_hy,
          name_ru: c.name_ru,
          type: c.type,
        }))
        .filter((c) => typeof c.name_en === "string" && c.name_en.length > 0);

      setCollectionTypes(collections);

      const matchedCollection = collections.find(
        (c) => c.name_en.toLowerCase().replace(/\s+/g, "-") === slug
      );
      setMatched(matchedCollection || null);
      setProducts(
        matchedCollection
          ? products.filter((p: Product) => p.collectionType === matchedCollection.name_en)
          : []
      );
      
      setBrands(
        brandsRaw.map((b: any) => ({
          _id: b._id || b.id,
          brand_en: b.name_en,
          brand_hy: b.name_hy,
          brand_ru: b.name_ru,
        }))
      );

      setLoading(false);
    });
  }, [slug]);


  // Helper: resolve brand _id from product.brand (object or string)
  const getBrandId = (brand: unknown): string | null => {
    if (!brand) return null;
    if (typeof brand === "object" && brand !== null) {
      const obj = brand as Record<string, unknown>;
      return typeof obj._id === "string" ? obj._id : null;
    }
    const s = String(brand);
    const found = brands.find((b) => b._id === s || b.brand_en === s);
    return found?._id ?? null;
  };

  // Helper: get brand label in current language (handles object or string)
  const getBrandLabel = (brand: unknown): string => {
    if (!brand) return "";
    if (typeof brand === "object" && brand !== null) {
      const obj = brand as Record<string, string | undefined>;
      const en = obj.brand_en ?? obj.name_en ?? "";
      const hy = obj.brand_hy ?? obj.name_hy ?? en;
      const ru = obj.brand_ru ?? obj.name_ru ?? en;
      return i18n.language === "hy" ? hy : i18n.language === "ru" ? ru : en;
    }
    const s = String(brand);
    const found = brands.find((b) => b._id === s || b.brand_en === s);
    if (!found) return s;
    return i18n.language === "hy"
      ? found.brand_hy
      : i18n.language === "ru"
      ? found.brand_ru
      : found.brand_en;
  };

  // Apply filter and sort
  let displayedProducts = [...products];

  if (brandFilter) {
    displayedProducts = displayedProducts.filter(
      (p) => getBrandId(p.brand) === brandFilter
    );
  }

  if (sortBy === "price-asc") {
    displayedProducts.sort((a, b) => (a.discount || a.price) - (b.discount || b.price));
  } else if (sortBy === "price-desc") {
    displayedProducts.sort((a, b) => (b.discount || b.price) - (a.discount || a.price));
  } else if (sortBy === "discount") {
    displayedProducts.sort(
      (a, b) =>
        (b.discount ? b.price - b.discount : 0) - (a.discount ? a.price - a.discount : 0)
    );
  } else if (sortBy === "latest") {
    displayedProducts = displayedProducts.slice().reverse(); // or use a date field if available
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12">{t("loading")}</div>;
  }

  if (!matched) return notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-chocolate mb-4">
        {i18n.language === "hy"
          ? matched.name_hy
          : i18n.language === "ru"
          ? matched.name_ru
          : matched.name_en}
      </h1>
      <p className="text-gray-700 mb-8">
        {t("explore_selection")}{" "}
        {i18n.language === "hy"
          ? matched.name_hy
          : i18n.language === "ru"
          ? matched.name_ru
          : matched.name_en}{" "}
        {t("handcrafted_chocolates")}.
      </p>

      {/* Filter and sort controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          className="border p-2 rounded"
          value={brandFilter ?? ""}
          onChange={e => setBrandFilter(e.target.value)}
        >
          <option value="">{t("all_brands")}</option>
          {brands.map(b => (
            <option key={b._id} value={b._id}>
              {i18n.language === "hy"
                ? b.brand_hy
                : i18n.language === "ru"
                ? b.brand_ru
                : b.brand_en}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={sortBy ?? ""}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="name-asc">{t("sort_options.name_asc")}</option>
          <option value="name-desc">{t("sort_options.name_desc")}</option>
          <option value="price-asc">{t("sort_options.price_low_to_high")}</option>
          <option value="price-desc">{t("sort_options.price_high_to_low")}</option>
        </select>
      </div>

      {displayedProducts.length === 0 ? (
        <div className="text-gray-500">{t("no_products_found")}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.map((product) => {

            return (
              <div
                key={product._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition relative flex flex-col"
              >
                {/* Full image as card background */}
                <div className="relative w-full aspect-[3/4]">
                  <a href={`/product/${product._id}`} className="block w-full h-full">
                    <img
                      src={safeImg(product.images?.[0])}
                      alt={product.name_en}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.onerror = null;
                        img.src = FALLBACK_IMG;
                      }}
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

                  {/* Brand badge: replace your existing badge with this */}
                  <span
                    className="
                      absolute top-3 right-3 bg-white/80 text-chocolate text-xs font-semibold px-2 py-1 rounded z-10
                      opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition
                    "
                  >
                    {getBrandLabel(product.brand)}
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
                  <h2 className="text-sm sm:text-base font-semibold mb-1 line-clamp-2 min-h-[32px] sm:min-h-[40px]">
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
      )}
    </main>
  );
}