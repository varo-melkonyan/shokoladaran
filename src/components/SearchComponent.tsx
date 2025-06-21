"use client";

import { useSearchParams } from "next/navigation";
import ProductList from "@/components/ProductList";
import products from "@/data/products.json";

export default function SearchComponent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";

  function handleAddToCart(product: any) {
    alert(`Added "${product.name}" to cart!`);
  }

  // Map id to _id and ensure status is always present
  const filtered = products
    .filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    )
    .map(product => ({
      ...product,
      _id: (product as any)._id || product.id, // ensure _id exists
      status: (product.status === "in_stock" || product.status === "out_of_stock")
        ? product.status as "in_stock" | "out_of_stock"
        : "in_stock", // provide a default if missing and ensure correct type
    }));

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Search results for:{" "}
        <span className="text-blue-500">{query}</span>
      </h1>
      {filtered.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <ProductList products={filtered} onAddToCart={handleAddToCart} />
      )}
    </div>
  );
}