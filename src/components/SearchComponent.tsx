"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import PieceCartControl from "@/components/PieceCartControl";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

type Brand = {
  brand_en: string;
  brand_hy: string;
  brand_ru: string;
};

export default function SearchComponent() {
  const { addToCart, removeFromCart, cart } = useCart();
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [productsRes, brandsRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/brands"),
        ]);
        const productsData = await productsRes.json();
        const brandsData = await brandsRes.json();
        setProducts(productsData);
        setBrands(
          brandsData.map((b: any) => ({
            brand_en: b.name_en,
            brand_hy: b.name_hy,
            brand_ru: b.name_ru,
          }))
        );
      } catch (err) {
        setProducts([]);
        setBrands([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Filter and normalize products
  const filtered = products
    .filter((product) =>
      product.name_en?.toLowerCase().includes(query.toLowerCase()) ||
      product.name_hy?.toLowerCase().includes(query.toLowerCase()) ||
      product.name_ru?.toLowerCase().includes(query.toLowerCase())
    )
    .map((product) => ({
      ...product,
      _id: product._id || product.id,
      status:
        product.status === "in_stock" ||
        product.status === "out_of_stock" ||
        product.status === "pre_order"
          ? product.status
          : "in_stock",
    }));

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
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {t("search_results_for")}: <span className="text-chocolate">{query}</span>
      </h1>
      {loading ? (
        <p className="text-gray-500">{t("loading")}</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">{t("no_results_found")}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {filtered.map((product) => {
            const cartItem = cart.find((ci: any) => ci._id === product._id);
            return (
              <div
                key={product._id}
                className="group bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition relative flex flex-col"
              >
                {/* Image and badges */}
                <div className="relative w-full aspect-[3/4]">
                  <Link href={product.link || `/product/${product._id}`}>
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
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
                  {/* Brand badge */}
                  {product.brand && (
                    <span className="
                      absolute top-3 right-3 bg-white/80 text-chocolate text-xs font-semibold px-2 py-1 rounded z-10
                      opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition
                    ">
                      {getBrandName(product.brand)}
                    </span>
                  )}
                  {/* Price badge */}
                  <span className="absolute bottom-3 left-3 bg-white/90 text-chocolate text-base font-bold px-3 py-1 rounded shadow z-10">
                    {typeof product.discount === "number" && product.discount < product.price ? (
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
                <div className="p-2 sm:p-4 flex flex-col items-start flex-1">
                  <h2 className="text-xs sm:text-base font-semibold mb-1 line-clamp-2 min-h-[28px] sm:min-h-[40px]">
                    {i18n.language === "hy"
                      ? product.name_hy
                      : i18n.language === "ru"
                      ? product.name_ru
                      : product.name_en}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 w-full justify-end">
                    <div className="mt-3 self-end pointer-events-auto opacity-100">
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
      )}
    </div>
  );
}