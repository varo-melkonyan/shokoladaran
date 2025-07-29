"use client";
import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import KgCartControl from "@/components/KgCartControl";
import PieceCartControl from "@/components/PieceCartControl";

export default function DiscountsClient({ discounted }: { discounted: any[] }) {
  const { addToCart, removeFromCart, cart } = useCart();

  const brands = useMemo(() => Array.from(new Set(discounted.map(p => p.brand)).values()).filter(Boolean), [discounted]);
  const collections = useMemo(() => Array.from(new Set(discounted.map(p => p.collectionType)).values()).filter(Boolean), [discounted]);

  const [brandFilter, setBrandFilter] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");

  let filtered = discounted.filter(
    p =>
      (!brandFilter || p.brand === brandFilter) &&
      (!collectionFilter || p.collectionType === collectionFilter)
  );

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => (a.discount ?? a.price) - (b.discount ?? b.price));
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => (b.discount ?? b.price) - (a.discount ?? a.price));
  if (sortBy === "name-asc") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "name-desc") filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <h1 className="text-4xl font-bold text-chocolate mb-10 text-center">Discounts</h1>
      <div className="flex flex-wrap gap-4 mb-8">
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
          <option value="price-asc">Price Low-High</option>
          <option value="price-desc">Price High-Low</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {filtered.map((item) => {
          const cartItem = cart.find((ci) => ci._id === item._id);

          return (
            <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition">
              <a href={`/product/${item._id}`}>
                <img src={item.images[0]} alt={item.name} className="w-full h-56 object-cover cursor-pointer" />
              </a>
              <div className="p-4">
                <h2 className="font-semibold text-chocolate text-base sm:text-lg md:text-xl lg:text-2xl">
                  {item.name}
                </h2>
                <div className="mt-2">
                  <span className="line-through text-gray-400 mr-2">{item.price} AMD</span>
                  <span className="text-red-600 font-bold">{item.discount} AMD</span>
                </div>
                {/* Cart controls */}
                <div className="mt-4">
                  {item.quantityType === "kg" ? (
                    <KgCartControl
                      product={item}
                      cartItem={cartItem}
                      addToCart={addToCart}
                    />
                  ) : (
                    <PieceCartControl
                      product={item}
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
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-8">No discounted products found.</div>
      )}
    </div>
  );
}