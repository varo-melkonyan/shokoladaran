import AllProductsClient from "./AllProductsClient";

async function fetchProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

  try {
    if (!baseUrl) return [];
    const res = await fetch(`${baseUrl}/api/admin/products`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function AllProductsPage() {
  const products = await fetchProducts();
  return <AllProductsClient products={products} />;
}
