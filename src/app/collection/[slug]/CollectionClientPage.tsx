"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

type CollectionType = {
  _id: string;
  name_en: string;
  name_hy: string;
  name_ru: string;
  type: "collection" | "children" | "dietary";
};

export default function CollectionClientPage({ slug }: { slug: string }) {
  const { addToCart, removeFromCart, cart } = useCart();
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>([]);
  const [matched, setMatched] = useState<CollectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const { t } = useTranslation();


  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then(res => res.json()),
      fetch("/api/admin/collection-types").then(res => res.json()),
    ]).then(([productsRaw, collectionsRaw]) => {
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
      setLoading(false);
    });
  }, [slug]);

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
          : matched.name_en} {t("handcrafted_chocolates")}.
      </p>

      {products.length === 0 ? (
        <div className="text-gray-500">{t("no_products_found")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => {
            const cartItem = cart.find((item) => item._id === product._id);
            
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
                  {/* Discount badge */}
                  {product.discount && (
                    <span className="absolute top-3 left-3 bg-chocolate text-white text-xs font-bold px-2 py-1 rounded z-10 opacity-0 group-hover:opacity-100 transition">
                      -{Math.round(100 - (product.discount / product.price) * 100)}%
                    </span>
                  )}
                  {/* Brand */}
                  {product.brand && (
                    <span className="absolute top-3 right-3 bg-white/80 text-chocolate text-xs font-semibold px-2 py-1 rounded z-10 opacity-0 group-hover:opacity-100 transition">
                      {product.brand}
                    </span>
                  )}
                  {/* Price badge */}
                  <span className="absolute bottom-3 left-3 bg-white/90 text-chocolate text-base font-bold px-3 py-1 rounded shadow z-10">
                    {product.discount ? (
                      <>
                        <span className="line-through text-gray-400 text-sm mr-2">{product.price} {t("amd")}</span>
                        <span className="text-chocolate font-bold">{product.discount} {t("amd")}</span>
                      </>
                    ) : (
                      <span className="text-chocolate font-bold">{product.price} {t("amd")}</span>
                    )}
                  </span>
                </div>

                {/* Product info always visible below the image */}
                <div className="p-4 flex flex-col items-start">
                  <h2 className="text-base font-semibold mb-1 line-clamp-2 min-h-[40px]">
                    {i18n.language === "hy"
                      ? product.name_hy
                      : i18n.language === "ru"
                      ? product.name_ru
                      : product.name_en}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 w-full justify-end">
                    {/* Cart controls now next to the price */}
                    <div
                      className=" transition pointer-events-none group-hover:pointer-events-auto"
                    >
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