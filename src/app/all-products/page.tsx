import fs from "fs";
import path from "path";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  weight: string;
  collectionType: string;
  brand: string;
  image: string;
  status?: string;
};

function getProducts(): Product[] {
  const productsPath = path.join(process.cwd(), "src/data/products.json");
  return JSON.parse(fs.readFileSync(productsPath, "utf-8"));
}

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

export default async function AllProductsPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;

  const products = getProducts();

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
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-chocolate">All Products</h1>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Left: Brand & Collection Filters */}
        <div className="flex flex-col gap-3 w-full">
          {/* Brand Filter */}
          <div>
            <div className="text-xs font-semibold mb-1 text-chocolate">Brand</div>
            <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-chocolate/20 scrollbar-track-transparent pb-1">
              <Link
                href={buildUrl({ collection: collectionFilter, sort: sortBy })}
                className={`whitespace-nowrap px-3 py-1 rounded-full border text-xs transition ${
                  !brandFilter
                    ? "bg-chocolate text-white border-chocolate shadow"
                    : "bg-white text-chocolate border-gray-200 hover:bg-chocolate/10"
                }`}
              >
                All
              </Link>
              {brands.map(brand => (
                <Link
                  key={brand}
                  href={buildUrl({ brand, collection: collectionFilter, sort: sortBy })}
                  className={`whitespace-nowrap px-3 py-1 rounded-full border text-xs transition ${
                    brandFilter === brand
                      ? "bg-chocolate text-white border-chocolate shadow"
                      : "bg-white text-chocolate border-gray-200 hover:bg-chocolate/10"
                  }`}
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
          {/* Collection Filter */}
          <div>
            <div className="text-xs font-semibold mb-1 text-chocolate">Collection</div>
            <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-chocolate/20 scrollbar-track-transparent pb-1">
              <Link
                href={buildUrl({ brand: brandFilter, sort: sortBy })}
                className={`whitespace-nowrap px-3 py-1 rounded-full border text-xs transition ${
                  !collectionFilter
                    ? "bg-chocolate text-white border-chocolate shadow"
                    : "bg-white text-chocolate border-gray-200 hover:bg-chocolate/10"
                }`}
              >
                All
              </Link>
              {collections.map(col => (
                <Link
                  key={col}
                  href={buildUrl({ brand: brandFilter, collection: col, sort: sortBy })}
                  className={`whitespace-nowrap px-3 py-1 rounded-full border text-xs transition ${
                    collectionFilter === col
                      ? "bg-chocolate text-white border-chocolate shadow"
                      : "bg-white text-chocolate border-gray-200 hover:bg-chocolate/10"
                  }`}
                >
                  {col}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="relative">
  <details className="w-32">
    <summary className="border border-black px-2 py-1 rounded flex items-center justify-between font-semibold text-sm bg-white cursor-pointer select-none list-none">
      Sort By:{" "}
      {{
        "name-asc": "Recommended",
        "price-desc": "Price (Highest)",
        "price-asc": "Price (Lowest)",
      }[sortBy] || "Recommended"}
      <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
    <ul className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
      <li>
        <Link
          href={buildUrl({ brand: brandFilter, collection: collectionFilter, sort: "name-asc" })}
          className={`block px-3 py-1 text-xs hover:bg-chocolate/10 ${
            sortBy === "name-asc" ? "font-bold text-chocolate bg-chocolate/5" : ""
          }`}
        >
          Recommended
        </Link>
      </li>
      <li>
        <Link
          href={buildUrl({ brand: brandFilter, collection: collectionFilter, sort: "price-desc" })}
          className={`block px-3 py-1 text-xs hover:bg-chocolate/10 ${
            sortBy === "price-desc" ? "font-bold text-chocolate bg-chocolate/5" : ""
          }`}
        >
          Price (Highest)
        </Link>
      </li>
      <li>
        <Link
          href={buildUrl({ brand: brandFilter, collection: collectionFilter, sort: "price-asc" })}
          className={`block px-3 py-1 text-xs hover:bg-chocolate/10 ${
            sortBy === "price-asc" ? "font-bold text-chocolate bg-chocolate/5" : ""
          }`}
        >
          Price (Lowest)
        </Link>
      </li>
    </ul>
  </details>
</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4">
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
                <span className={`px-2 py-1 rounded ${product.status === "in_stock" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
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
  );
}