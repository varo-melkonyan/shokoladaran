"use client";
import { notFound } from "next/navigation";
import { useEffect, useState, use } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

type Props = {
  params: Promise<{ slug: string }>;
};

type CollectionType = {
  id: string;
  name: string;
  type: "collection" | "dietary";
};

export default function CollectionPage({ params }: Props) {
  const { slug } = use(params);
  const { cart, addToCart } = useCart();
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>([]);
  const [matched, setMatched] = useState<CollectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/collection-types").then(res => res.json()),
      fetch("/api/admin/products").then(res => res.json()),
    ]).then(([types, prods]) => {
      setCollectionTypes(types);
      setProducts(prods);
      const found = types.find(
        (type: CollectionType) => type.name.toLowerCase().replace(/\s+/g, "-") === slug
      );
      setMatched(found || null);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-12">Loading...</div>;
  }

  if (!matched) return notFound();

  const filteredProducts = products.filter(
    (p) => p.collectionType === matched.name
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-chocolate mb-4">
        {matched.name}
      </h1>
      <p className="text-gray-700 mb-8">
        Explore our selection of {matched.name} chocolates handcrafted by local artisans.
      </p>

      {filteredProducts.length === 0 ? (
        <div className="text-gray-500">No products found in this collection.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {/* Info Button in top-right */}
                <div className="absolute top-2 right-2 group">
                  <button
                    className="bg-white/90 hover:bg-chocolate text-chocolate hover:text-white rounded-full w-8 h-8 flex items-center justify-center shadow transition-colors duration-200 border border-gray-200"
                    type="button"
                    aria-label="Product info"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="white"/>
                      <rect x="9.25" y="8" width="1.5" height="5" rx="0.75" fill="currentColor"/>
                      <rect x="9.25" y="5" width="1.5" height="1.5" rx="0.75" fill="currentColor"/>
                    </svg>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-xs text-gray-700 z-20 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                    <div className="mb-1"><b>Brand:</b> {product.brand}</div>
                    <div className="mb-1"><b>Weight:</b> {product.weight}</div>
                    <div className="mb-1"><b>Collection Type:</b> {product.collectionType}</div>
                    { product.status && (
                      <div className="mb-1"><b>Status:</b> {product.status}</div>
                    )}
                    { product.ingredients && (
                      <div className="mb-1">
                        <b>Ingredients:</b> {Array.isArray(product.ingredients)
                          ? product.ingredients.join(", ")
                          : product.ingredients}
                      </div>
                    )}
                    { product.shelfLife && (
                      <div className="mb-1"><b>Shelf Life:</b> {product.shelfLife}</div>
                    )}
                    { product.nutritionFacts && (
                      <div className="mb-1">
                        <b>Nutrition Facts:</b>
                        <ul className="ml-2 list-disc">
                          {Object.entries(product.nutritionFacts).map(([key, value]) => (
                            <li key={key}><b>{key}:</b> {value}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-chocolate text-lg">
                    {product.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-500">
                  {product.discount ? (
                    <>
                      <span className="line-through mr-2">{product.price} AMD</span>
                      <span className="text-red-600">{product.discount} AMD</span>
                    </>
                  ) : (
                    <>{product.price} AMD</>
                  )}
                  {" • "}
                  {product.weight}
                </p>
                <p className="text-xs text-gray-400 mt-1">{product.brand}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image
                    })}
                    className="bg-chocolate text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}