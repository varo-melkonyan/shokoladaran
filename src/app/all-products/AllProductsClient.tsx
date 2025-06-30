"use client";
import { useState, useMemo } from "react";

type Product = {
  _id: string;
  name: string;
  price: number;
  weight: string;
  collectionType: string;
  brand: string;
  image: string;
  status?: string;
  readyAfter?: string; // e.g. "2 days"
  discount?: number;
  ingredients?: string[];
  shelfLife?: string;
  nutritionFacts?: { [key: string]: string };
};

function getUnique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr)).filter(Boolean);
}

export default function AllProductsClient({ products }: { products: Product[] }) {
  const [brandFilter, setBrandFilter] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  const brands = useMemo(() => getUnique(products.map(p => p.brand)), [products]);
  const collections = useMemo(() => getUnique(products.map(p => p.collectionType)), [products]);

  let filtered = products.filter(
    p =>
      (!brandFilter || p.brand === brandFilter) &&
      (!collectionFilter || p.collectionType === collectionFilter)
  );

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "name-asc") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "name-desc") filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-chocolate">All Products</h1>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={collectionFilter}
          onChange={e => setCollectionFilter(e.target.value)}
        >
          <option value="">All Collections</option>
          {collections.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-asc">Price Low-High</option>
          <option value="price-desc">Price High-Low</option>
        </select>
      </div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow p-4 relative">
            <div className="relative">
              <a href={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-4 cursor-pointer"
                />
              </a>
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
                  {product.name && (
                    <div className="mb-1"><b>Name:</b> {product.name}</div>
                  )}
                  {(product.discount || product.price) && (
                    <div className="mb-1">
                      <b>Price:</b> {product.discount ? `${product.discount} AMD (Discounted)` : `${product.price} AMD`}
                    </div>
                  )}
                  {product.brand && (
                    <div className="mb-1"><b>Brand:</b> {product.brand}</div>
                  )}
                  {product.weight && (
                    <div className="mb-1"><b>Weight:</b> {product.weight} g</div>
                  )}
                  {product.collectionType && (
                    <div className="mb-1"><b>Collection Type:</b> {product.collectionType}</div>
                  )}
                  {product.status && (
                    <div className="mb-1"><b>Status:</b> {product.status}</div>
                  )}
                  {product.ingredients && (
                    <div className="mb-1">
                      <b>Ingredients:</b> {Array.isArray(product.ingredients)
                        ? product.ingredients.join(", ")
                        : product.ingredients}
                    </div>
                  )}
                  {product.shelfLife && (
                    <div className="mb-1"><b>Shelf Life:</b> {product.shelfLife}</div>
                  )}
                  {product.nutritionFacts && (
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
            <h2 className="font-semibold text-chocolate text-base md:text-l lg:text-l">
              {product.name}
            </h2>
            <div className="text-sm text-gray-600">{product.brand}</div>
            <div className="text-sm text-gray-500">{product.collectionType}</div>
            <div className="mt-2 text-chocolate font-bold">{product.price} AMD</div>
            <div className="text-xs text-gray-400">{product.weight} g</div>
            {product.status && (
              <div className="text-xs mt-1">
                <span
                  className={`px-2 py-1 rounded ${
                    product.status === "in_stock"
                      ? "bg-green-100 text-green-700"
                      : product.status === "pre_order"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.status === "in_stock" && "In Stock"}
                  {product.status === "pre_order" && (
                    <>
                      Pre-order
                      {product.readyAfter ? ` (Ready in ${product.readyAfter})` : ""}
                    </>
                  )}
                  {product.status === "out_of_stock" && "No Product"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-8">No products found.</div>
      )}
    </div>
  );
}