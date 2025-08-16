"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import Link from "next/link";

export default function VendorClientPage({ slug }: { slug: string }) {
  const { addToCart, cart, setCart } = useCart();
  const [brand, setBrand] = useState<any | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [collectionFilter, setCollectionFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [collectionTypes, setCollectionTypes] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [sortBy, setSortBy] = useState("price-asc");
  const { t } = useTranslation();

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/brands").then(res => res.json()),
      fetch("/api/admin/products").then(res => res.json()),
      fetch("/api/admin/collection-types").then(res => res.json()),
    ]).then(([brandsRaw, productsRaw, collectionsRaw]) => {
      const brands = brandsRaw.map((b: any) => ({
        _id: b._id || b.id,
        name_en: b.name_en,
        name_hy: b.name_hy,
        name_ru: b.name_ru,
        images: b.images,
        description: b.description,
        website: b.website,
      }));

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
        status: p.status ?? "in_stock",
        readyAfter: p.readyAfter,
        ingredients: p.ingredients,
        shelfLife: p.shelfLife,
        nutritionFacts: p.nutritionFacts,
        quantityType: p.quantityType || "pieces",
      }));

      setCollectionTypes(
        collectionsRaw.map((c: any) => ({
          _id: c._id || c.id,
          name_en: c.name_en,
          name_hy: c.name_hy,
          name_ru: c.name_ru,
          type: c.type,
        }))
      );

      // Match by slug (id in URL)
      const matchedBrand = brands.find(
        (b: any) => b.name_en.toLowerCase().replace(/\s+/g, "-") === slug
      );
      setBrand(matchedBrand || null);

      setProducts(
        matchedBrand
          ? products.filter((p: Product) => p.brand === matchedBrand.name_en)
          : []
      );
      setLoading(false);
    });
  }, [slug]);

  function removeFromCart(productId: string) {
    setCart(cart => cart.filter(item => item._id !== productId));
  }

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-12">{t("loading")}</div>;
  if (!brand) return notFound();

  // Map to collection objects for dropdown
  const collectionOptions = collectionTypes;

  // Filter by collection
  let filteredProducts = products.filter((p) => {
    if (!collectionFilter) return true;
    if (
      p.collectionType &&
      typeof p.collectionType === "object" &&
      p.collectionType !== null &&
      "_id" in p.collectionType &&
      typeof (p.collectionType as { _id?: string })._id === "string"
    ) {
      return (p.collectionType as { _id: string })._id === collectionFilter;
    }
    // If collectionType is a string, try to match with collection _id or name
    const col = collectionTypes.find(
      (c: any) =>
        c._id === collectionFilter ||
        c.name_en === collectionFilter ||
        c.name_hy === collectionFilter ||
        c.name_ru === collectionFilter
    );
    return (
      p.collectionType === collectionFilter ||
      p.collectionType === col?.name_en ||
      p.collectionType === col?.name_hy ||
      p.collectionType === col?.name_ru
    );
  });
  // Sorting
  if (sortBy === "price-asc") filteredProducts = [...filteredProducts].sort((a, b) => (a.discount ?? a.price) - (b.discount ?? b.price));
  if (sortBy === "price-desc") filteredProducts = [...filteredProducts].sort((a, b) => (b.discount ?? b.price) - (a.discount ?? a.price));
  if (sortBy === "name-asc") filteredProducts = [...filteredProducts].sort((a, b) =>
    (a.name_en || "").localeCompare(b.name_en || "")
  );
  if (sortBy === "name-desc") filteredProducts = [...filteredProducts].sort((a, b) =>
    (b.name_en || "").localeCompare(a.name_en || "")
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {brand.images && (
          <img
            src={brand.images[0]}
            alt={brand.name_en}
            className="w-40 h-40 object-cover rounded shadow"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-chocolate mb-2">
            {i18n.language === "hy"
              ? brand.name_hy
              : i18n.language === "ru"
              ? brand.name_ru
              : brand.name_en}
          </h1>
          {brand.description && (
            <p className="mb-4 text-gray-700">{brand.description}</p>
          )}
          {brand.website && (
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-chocolate text-white px-4 py-2 rounded mb-2"
            >
              {t("visit_website")}
            </a>
          )}
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-chocolate mb-6">{t("products")}</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={collectionFilter}
            onChange={e => setCollectionFilter(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          >
            <option value="">{t("all_collections")}</option>
            {collectionTypes.map((col: any) => (
              <option key={col._id} value={col._id}>
                {i18n.language === "hy"
                  ? col.name_hy
                  : i18n.language === "ru"
                  ? col.name_ru
                  : col.name_en}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          >
            <option value="name-asc">{t("sort_options.name_asc")}</option>
            <option value="name-desc">{t("sort_options.name_desc")}</option>
            <option value="price-asc">{t("sort_options.price_low_to_high")}</option>
            <option value="price-desc">{t("sort_options.price_high_to_low")}</option>
          </select>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const cartItem = cart.find((item) => item._id === product._id);

              // Brand badge (always in 3 languages)
              const brandBadge = (
                <span className="
                  absolute top-3 right-3 bg-white/80 text-chocolate text-xs font-semibold px-2 py-1 rounded z-10
                  opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition
                ">
                  {i18n.language === "hy"
                    ? brand.name_hy
                    : i18n.language === "ru"
                    ? brand.name_ru
                    : brand.name_en}
                </span>
              );

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition relative flex flex-col"
                >
                  <div className="relative w-full aspect-[3/4]">
                    <Link href={`/product/${product._id}`}>
                      <img
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.name_en}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </Link>
                    {/* Discount badge */}
                    {typeof product.discount === "number" && product.discount < product.price && (
                      <span className="
                        absolute top-3 left-3 bg-chocolate text-white text-xs font-bold px-2 py-1 rounded z-10
                        opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition
                      ">
                        -{Math.round(100 - (product.discount / product.price) * 100)}%
                      </span>
                    )}
                    {/* Brand badge */}
                    {brandBadge}
                    {/* Price badge */}
                    <span className="absolute bottom-3 left-3 bg-white/90 text-chocolate text-base font-bold px-3 py-1 rounded shadow z-10">
                      {typeof product.discount === "number" && product.discount < product.price ? (
                        <>
                          <span className="line-through text-gray-400 text-sm mr-2">{product.price} {t("amd")}</span>
                          <span className="text-chocolate font-bold">{product.discount} {t("amd")}</span>
                        </>
                      ) : (
                        <span className="text-chocolate font-bold">{product.price} {t("amd")}</span>
                      )}
                    </span>
                  </div>
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
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 mt-12">{t("no_products_found")}</div>
        )}
      </section>
    </main>
  );
}