"use client";
import { useState } from "react";
import ProductInfoModal from "@/components/ProductInfoModal";
import { Product } from "@/types/product";

export default function ProductList({
  products,
  onAddToCart,
}: {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!products.length) {
    return <div className="text-center text-gray-500 mt-8">No products found.</div>;
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {products.map(product => (
          <div
            key={product._id}
            className="bg-gray-50 rounded-xl shadow-md overflow-hidden"
          >
            <div className="relative">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
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
                  <div className="mb-1"><b>Name:</b> {product.name}</div>
                  <div className="mb-1"><b>Price:</b> {product.discount ? `${product.discount} AMD (Discounted)` : `${product.price} AMD`}</div>
                  <div className="mb-1"><b>Brand:</b> {product.brand}</div>
                  <div className="mb-1"><b>Weight:</b> {product.weight} g</div>
                  <div className="mb-1"><b>Collection Type:</b> {product.collectionType}</div>
                  { (product.status) && (
                    <div className="mb-1"><b>Status:</b> {product.status}</div>
                  )}
                  { (product.ingredients) && (
                    <div className="mb-1">
                      <b>Ingredients:</b> {Array.isArray(product.ingredients)
                        ? (product.ingredients).join(", ")
                        : (product.ingredients)}
                    </div>
                  )}
                  { (product.shelfLife) && (
                    <div className="mb-1"><b>Shelf Life:</b> {product.shelfLife}</div>
                  )}
                  { (product.nutritionFacts) && (
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
              <h2 className="font-semibold text-chocolate text-base md:text-l lg:text-l">
  {product.name}
</h2>
              <p className="text-xs text-gray-400 mt-1">{product.collectionType}</p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  className="bg-chocolate text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                  type="button"
                  onClick={() => onAddToCart && onAddToCart(product)}
                >
                  <span role="img" aria-label="cart">🛒</span> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
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