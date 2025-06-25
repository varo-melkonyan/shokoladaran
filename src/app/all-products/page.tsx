import AllProductsClient from "./AllProductsClient";

async function fetchProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shokoladaran.vercel.app";
  const res = await fetch(`${baseUrl}/api/admin/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function AllProductsPage() {
  const products = await fetchProducts();
  return <AllProductsClient products={products} />;
}