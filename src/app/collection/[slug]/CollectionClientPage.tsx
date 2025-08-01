"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";

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

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then(res => res.json()),
      fetch("/api/admin/collection-types").then(res => res.json()),
    ]).then(([productsRaw, collectionsRaw]) => {
      const products = productsRaw.map((p: any) => ({
        _id: p._id || p.id,
        name: p.name,
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
    return <div className="max-w-7xl mx-auto px-4 py-12">Loading...</div>;
  }

  if (!matched) return notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-chocolate mb-4">
        {matched.name}
      </h1>
      <p className="text-gray-700 mb-8">
        Explore our selection of {matched.name} chocolates handcrafted by local artisans.
      </p>

      {products.length === 0 ? (
        <div className="text-gray-500">No products found in this collection.</div>
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
                      alt={product.name}
                      className="w-full h-40 object-cover mb-2 cursor-pointer"
                    />
                  </a>
                  {/* Info Button in top-right */}
                  {/* <div className="absolute top-2 right-2 group">
                    <button
                      className="bg-white/90 hover:bg-chocolate text-chocolate hover:text-white rounded-full w-8 h-8 flex items-center justify-center shadow transition-colors duration-200 border border-gray-200"
                      type="button"
                      aria-label="Product info"
                    > */}
                      {/* Small info SVG icon */}
                      {/* <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="white"/>
                        <rect x="9.25" y="8" width="1.5" height="5" rx="0.75" fill="currentColor"/>
                        <rect x="9.25" y="5" width="1.5" height="1.5" rx="0.75" fill="currentColor"/>
                      </svg>
                    </button> */}
                    {/* Tooltip */}
                    {/* <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-xs text-gray-700 z-20 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                      {item.brand && <div className="mb-1"><b>Brand:</b> {item.brand}</div>}
                      {item.weight && <div className="mb-1"><b>Weight:</b> {item.weight}</div>}
                      {item.collectionType && <div className="mb-1"><b>Collection Type:</b> {item.collectionType}</div>}
                      {item.status && <div className="mb-1"><b>Status:</b> {item.status}</div>}
                      {item.ingredients && (
                        <div className="mb-1">
                          <b>Ingredients:</b> {Array.isArray(item.ingredients)
                            ? item.ingredients.filter(Boolean).join(", ")
                            : item.ingredients}
                        </div>
                      )}
                      {item.readyAfter && <div className="mb-1"><b>Ready After:</b> {item.readyAfter}</div>}
                      {item.shelfLife && <div className="mb-1"><b>Shelf Life:</b> {item.shelfLife}</div>}
                      {item.nutritionFacts && typeof item.nutritionFacts === "object" && Object.keys(item.nutritionFacts).length > 0 && (
                        <div className="mb-1">
                          <b>Nutrition Facts:</b>
                          <ul className="ml-2 list-disc">
                            {Object.entries(item.nutritionFacts).map(([key, value]) =>
                              value ? <li key={key}><b>{key}:</b> {value as string}</li> : null
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div> */}
                </div>
                <h2 className="text-lg font-bold">{product.name}</h2>
                <div className="mt-2">
                  {product.discount ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">{product.price} AMD</span>
                      <span className="text-chocolate font-bold">{product.discount} AMD</span>
                    </>
                  ) : (
                    <span className="text-chocolate font-bold">{product.price} AMD</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{product.weight} g</p>
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