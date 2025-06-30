"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductList from "@/components/ProductList";
import { useCart } from "@/context/CartContext";


export default function SearchComponent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Filter and normalize products
  const filtered = products
    .filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
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

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Search results for: <span className="text-chocolate">{query}</span>
      </h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <ProductList products={filtered} onAddToCart={addToCart} />
      )}
    </div>
  );
}