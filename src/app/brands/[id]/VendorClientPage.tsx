"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import clsx from "clsx"; // If you want to use conditional classnames (optional)

type Brand = {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  website?: string;
};

type CollectionType = {
  _id: string;
  name: string;
  type: string;
};

export default function VendorClientPage({ slug }: { slug: string }) {
  const { addToCart, cart } = useCart(); // <-- get cart from context

  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | "">("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/brands").then(res => res.json()),
      fetch("/api/admin/products").then(res => res.json()),
      fetch("/api/admin/collection-types").then(res => res.json()),
    ]).then(([brandsRaw, productsRaw, collectionsRaw]) => {
      const brands = brandsRaw.map((b: any) => ({
        _id: b._id || b.id,
        name: b.name,
        image: b.image,
        description: b.description,
        website: b.website,
      }));

      const products = productsRaw.map((p: any) => ({
        _id: p._id || p.id,
        name: p.name,
        price: p.price,
        weight: p.weight,
        discount: p.discount,
        collectionType: p.collectionType,
        brand: p.brand,
        image: p.image,
        link: p.link,
        status: p.status ?? "in_stock",
        readyAfter: p.readyAfter,
        ingredients: p.ingredients,
        shelfLife: p.shelfLife,
        nutritionFacts: p.nutritionFacts,
      }));

      const collections = collectionsRaw.map((c: any) => ({
        _id: c._id || c.id,
        name: c.name,
        type: c.type,
      }));

      // Match by slug (id in URL)
      const matchedBrand = brands.find(
        (b: Brand) => b.name.toLowerCase().replace(/\s+/g, "-") === slug
      );
      setBrand(matchedBrand || null);
      setCollectionTypes(collections);
      setProducts(
        matchedBrand
          ? products.filter((p: Product) => p.brand === matchedBrand.name)
          : []
      );
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-12">Loading...</div>;
  if (!brand) return notFound();

  let filteredProducts = products;
  if (selectedCollection !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.collectionType === selectedCollection
    );
  }

  if (priceSort === "asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => (a.discount ?? a.price) - (b.discount ?? b.price));
  } else if (priceSort === "desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.discount ?? b.price) - (a.discount ?? a.price));
  }

  const brandCollections = Array.from(
    new Set(products.map((p) => p.collectionType))
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {brand.image && (
          <img
            src={brand.image}
            alt={brand.name}
            className="w-40 h-40 object-cover rounded shadow"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-chocolate mb-2">{brand.name}</h1>
          {brand.description && (
            <p className="mb-4 text-gray-700">{brand.description}</p>
          )}
          {brand.website && (
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-chocolate text-white px-4 py-2 rounded mb-2"
            >
              Visit Brand Site
            </a>
          )}
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-chocolate mb-6">Products</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedCollection}
            onChange={e => setSelectedCollection(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All Collections</option>
            {brandCollections.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          <select
            value={priceSort}
            onChange={e => setPriceSort(e.target.value as "asc" | "desc" | "")}
            className="border p-2 rounded"
          >
            <option value="">Sort by Price</option>
            <option value="asc">Lowest First</option>
            <option value="desc">Highest First</option>
          </select>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {filteredProducts.map((product) => {
              // Find quantity in cart
              const cartItem = cart.find((item) => item._id === product._id);
              const quantity = cartItem?.quantity ?? 0;

              return (
                <div key={product._id} className="bg-white rounded-lg shadow p-4 relative">
                  <div className="relative">
                    {product.image && (
                      <a href={`/product/${product._id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded mb-4 cursor-pointer"
                        />
                      </a>
                    )}
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
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-xs text-gray-700 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
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
                        {product.readyAfter && (
                          <div className="mb-1"><b>Ready After:</b> {product.readyAfter}</div>
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
                  <div className="flex items-center justify-between mb-1 mt-2">
                    <h2 className="font-semibold text-chocolate text-base md:text-l lg:text-l">
                      {product.name}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500">
                    {product.discount ? (
                      <>
                        <span className="line-through mr-2">{product.price} AMD</span>
                        <span className="text-red-600">{product.discount} AMD</span>
                      </>
                    ) : (
                      <>{product.price} AMD</>
                    )}
                    {" • "}
                    {product.weight} g
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{product.collectionType}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => addToCart({
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        discount: product.discount,
                        image: product.image,
                        status: ""
                      })}
                      className="bg-chocolate text-white px-3 py-1 rounded text-xs flex items-center gap-1 relative"
                    >
                      🛒 Add to Cart
                      {quantity > 0 && (
                        <span
                          className={clsx(
                            "ml-2 px-2 py-0.5 rounded-full text-xs font-bold",
                            quantity > 0 ? "bg-green-500" : "bg-red-500"
                          )}
                        >
                          {quantity}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 mt-12">No products found for this brand.</div>
        )}
      </section>
    </main>
  );
}