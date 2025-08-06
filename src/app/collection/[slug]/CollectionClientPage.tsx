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
  name: string;
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

      const collections = collectionsRaw.map((c: any) => ({
        _id: c._id || c.id,
        name: c.name,
        type: c.type,
      }));

      setCollectionTypes(collections);

      const matchedCollection = collections.find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug
      );
      setMatched(matchedCollection || null);
      setProducts(
        matchedCollection
          ? products.filter((p: Product) => p.collectionType === matchedCollection.name)
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
        {matched.name}
      </h1>
      <p className="text-gray-700 mb-8">
        {t("explore_selection")} {matched.name} {t("handcrafted_chocolates")}.
      </p>

      {products.length === 0 ? (
        <div className="text-gray-500">{t("no_products_found")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => {
            const cartItem = cart.find((item) => item._id === product._id);
            
            return (
              <div key={product._id} className="bg-white shadow rounded-lg overflow-hidden p-4 relative">
                <div className="relative">
                  <a href={`/product/${product._id}`}>
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name_en}
                      className="w-full h-40 object-cover mb-2 cursor-pointer"
                    />
                  </a>
                </div>
                <h2 className="text-lg font-bold">{
                    i18n.language === "hy"
                      ? product.name_hy
                      : i18n.language === "ru"
                      ? product.name_ru
                      : product.name_en
                  }</h2>
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
                
                {/* Cart controls */}
                <div className="mt-2">
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
            );
          })}
        </div>
      )}
    </main>
  );
}