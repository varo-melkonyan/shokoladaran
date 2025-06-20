"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

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
  const { addToCart } = useCart();

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow p-4 relative">
                <div className="relative">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded mb-4"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between mb-1 mt-2">
                  <h3 className="text-lg font-bold text-chocolate">{product.name}</h3>
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
                  {product.weight}
                </p>
                <p className="text-xs text-gray-400 mt-1">{product.collectionType}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => addToCart({
                      _id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.image
                    })}
                    className="bg-chocolate text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 mt-12">No products found for this brand.</div>
        )}
      </section>
    </main>
  );
}