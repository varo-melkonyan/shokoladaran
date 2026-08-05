import AllProductsClient from "./AllProductsClient";
import { fallbackProducts } from "@/data/fallbackCatalog";

async function fetchProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

  try {
    if (!baseUrl) return [...fallbackProducts];
    const res = await fetch(`${baseUrl}/api/admin/products`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return [...fallbackProducts];
    const data = await res.json();
    return Array.isArray(data) && data.length ? data : [...fallbackProducts];
  } catch {
    return [...fallbackProducts];
  }
}

export default async function AllProductsPage() {
  const products = await fetchProducts();
  return <AllProductsClient products={products} />;
}
