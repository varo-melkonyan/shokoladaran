"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Product } from "@/types/product";

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

export default function DiscountsClient({ discounted }: { discounted: any[] }) {
  const { addToCart, removeFromCart, cart } = useCart();
  const { t } = useTranslation();
  const [brands, setBrands] = useState<Brand[]>([]);

  const [collections, setCollectionTypes] = useState<CollectionType[]>([]);

  const [brandFilter, setBrandFilter] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");


  const [matched, setMatched] = useState<CollectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);


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
        (c) => c.name_en.toLowerCase().replace(/\s+/g, "-") === discounted
      );
      setMatched(matchedCollection || null);
      setProducts(
        matchedCollection
          ? products.filter((p: Product) => p.collectionType === matchedCollection.name_en)
          : []
      );
      
      setBrands(
        (brandsRaw as Array<{ _id?: string; id?: string; name_en: string; name_hy: string; name_ru: string }>)
          .map((b) => ({
            _id: (b._id || b.id) as string,
            brand_en: b.name_en,
            brand_hy: b.name_hy,
            brand_ru: b.name_ru,
          }))
      );

      setLoading(false);
    });
  }, [discounted]);

  // Helper: get brand label in current language (handles object or string)
  const getBrandLabel = (brand: unknown): string => {
    if (!brand) return "";
    // Brand is object with brand_* or name_* keys
    if (typeof brand === "object" && brand !== null) {
      const obj = brand as Record<string, string | undefined>;
      const en = obj.brand_en ?? obj.name_en ?? "";
      const hy = obj.brand_hy ?? obj.name_hy ?? en;
      const ru = obj.brand_ru ?? obj.name_ru ?? en;
      return i18n.language === "hy" ? hy : i18n.language === "ru" ? ru : en;
    }
    // Brand is string: try to resolve by _id or English name
    const s = String(brand);
    const found = brands.find((b) => b._id === s || b.brand_en === s);
    if (!found) return s;
    return i18n.language === "hy"
      ? found.brand_hy
      : i18n.language === "ru"
      ? found.brand_ru
      : found.brand_en;
  };

  let filtered = discounted.filter(
    p =>
      (!brandFilter || p.brand === brandFilter) &&
      (!collectionFilter || p.collectionType === collectionFilter)
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
      <h1 className="text-4xl font-bold text-chocolate mb-10 text-center">{t("discounts")}</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={brandFilter}
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
          className="border p-2 rounded w-full sm:w-auto"
          value={collectionFilter}
          onChange={e => setCollectionFilter(e.target.value)}
        >
          <option value="">{t("all_collections")}</option>
            {collections.map(b => (
            <option key={b.name_en} value={b.name_en}>
              {i18n.language === "hy"
                ? b.name_hy
                : i18n.language === "ru"
                ? b.name_ru
                : b.name_en}
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
        {filtered.map((product) => {
          return (
            <div
              key={product._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition relative flex flex-col"
            >
              <div className="relative w-full aspect-[3/4]">
                <a href={`/product/${product._id}`} className="block w-full h-full">
                  <img
                    src={safeImg(product.images?.[0])}
                    alt={product.name_en || "Product"}
                    className="w-full h-full object-cover"
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

                <span
                  className="
                    absolute top-3 right-3 bg-white/80 text-chocolate text-xs font-semibold px-2 py-1 rounded z-10
                    opacity-100
                    sm:opacity-0 sm:group-hover:opacity-100
                    transition
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
        <div className="text-center text-gray-500 mt-8">No discounted products found.</div>
      )}
    </div>
  );
}