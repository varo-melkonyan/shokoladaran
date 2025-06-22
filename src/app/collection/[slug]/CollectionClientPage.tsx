"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

type CollectionType = {
  _id: string;
  name: string;
  type: "collection" | "children" | "dietary";
};

export default function CollectionClientPage({ slug }: { slug: string }) {
  const { addToCart } = useCart();
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>([]);
  const [matched, setMatched] = useState<CollectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then(res => res.json()),
      fetch("/api/admin/collection-types").then(res => res.json()),
    ]).then(([productsRaw, collectionsRaw]) => {
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
        status: p.status,
        ingredients: p.ingredients,
        shelfLife: p.shelfLife,
        nutritionFacts: p.nutritionFacts,
      }));

      const collections = collectionsRaw.map((c: any) => ({
        _id: c._id || c.id,
        name: c.name,
        type: c.type,
      }));

      setCollectionTypes(collections);

      const matchedCollection = collections.find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug
      );
      setMatched(matchedCollection || null);
      setProducts(
        matchedCollection
          ? products.filter((p: Product) => p.collectionType === matchedCollection.name)
          : []
      );
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-12">Loading...</div>;
  }

  if (!matched) return notFound();

  console.log("Products to render:", products);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-chocolate mb-4">
        {matched.name}
      </h1>
      <p className="text-gray-700 mb-8">
        Explore our selection of {matched.name} chocolates handcrafted by local artisans.
      </p>

      {products.length === 0 ? (
        <div className="text-gray-500">No products found in this collection.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow rounded-lg overflow-hidden p-4">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-chocolate">{product.price} AMD</p>
              <p className="text-sm text-gray-500">{product.weight}</p>
              {/* Add more fields as needed */}
              <button
                className="mt-2 bg-chocolate text-white px-4 py-2 rounded"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}