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

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Search results for: <span className="text-chocolate">{query}</span>
      </h1>
      <ProductList products={filtered} onAddToCart={handleAddToCart} />
    </div>
  );
}