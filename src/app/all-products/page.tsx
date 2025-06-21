import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  price: number;
  weight: string;
  collectionType: string;
  brand: string;
  image: string;
  status?: string;
};

function getUnique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr)).filter(Boolean);
}

function buildUrl(params: Record<string, string | undefined>) {
  const search = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => typeof v === "string" && v.length > 0)
      .map(([k, v]) => [k, v as string])
  );
  return `/all-products?${search.toString()}`;
}

async function fetchProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shokoladaran.vercel.app";
  const res = await fetch(`${baseUrl}/api/admin/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function AllProductsPage({ searchParams }: { searchParams: any }) {
  const params = searchParams;
  const products = await fetchProducts();

  const brandFilter = params?.brand || "";
  const collectionFilter = params?.collection || "";
  const sortBy = params?.sort || "name-asc";

  const brands = getUnique(products.map(p => p.brand));
  const collections = getUnique(products.map(p => p.collectionType));

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
    <>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-chocolate">All Products</h1>
        {/* ...filters and product grid as before... */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* ...Brand and Collection filters... */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h2 className="text-lg font-semibold text-chocolate">{product.name}</h2>
              <div className="text-sm text-gray-600">{product.brand}</div>
              <div className="text-sm text-gray-500">{product.collectionType}</div>
              <div className="mt-2 text-chocolate font-bold">{product.price} AMD</div>
              <div className="text-xs text-gray-400">{product.weight}</div>
              {product.status && (
                <div className="text-xs mt-1">
                  <span
                    className={`px-2 py-1 rounded ${
                      product.status === "in_stock"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.status === "in_stock" ? "In Stock" : "No Product"}
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
      {/* ...dropdown script as before... */}
    </>
  );
}