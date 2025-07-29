"use client";
import { useState } from "react";
import ProductInfoModal from "@/components/ProductInfoModal";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";

export default function ProductList({
  products,
  onAddToCart,
}: {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { cart, removeFromCart, addToCart } = useCart();

  if (!products.length) {
    return <div className="text-center text-gray-500 mt-8">No products found.</div>;
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {products.map(product => {
          const cartItem = cart.find((item) => item._id === product._id);

          return (
            <div
              key={product._id}
              className="bg-gray-50 rounded-xl shadow-md overflow-hidden"
            >
              <div className="relative">
                {product.images && (
                  <a href={`/product/${product._id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover cursor-pointer"
                    />
                  </a>
                )}
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
              <div className="p-4">
                <h2 className="font-semibold text-chocolate text-base md:text-l lg:text-l">
                  {product.name}
                </h2>
                <p className="text-xs text-gray-400 mt-1">{product.collectionType}</p>
                <div className="mt-3">
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
          );
        })}
      </div>
      {selectedProduct && (
        <ProductInfoModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}