"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Brand = {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  website?: string;
};

type Collection = {
  id: string;
  name: string;
  brand: string;
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/brands")
  .then(res => res.json())
  .then(data => setBrands(data.map((b: any) => ({
    _id: b._id || b.id,
    name: b.name,
  }))));
    fetch("/api/admin/collection-types")
  .then(res => res.json())
  .then(data => setCollections(data.map((c: any) => ({
    _id: c._id || c.id,
    name: c.name,
  }))));
  }, []);

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-12">Loading...</div>;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-chocolate mb-8">Brands</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {brands.map((brand) => (
          <div key={brand._id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            {brand.image && (
              <img
                src={brand.image}
                alt={brand.name}
                className="w-24 h-24 object-cover rounded-full mb-4"
              />
            )}
            <h2 className="text-xl font-bold text-chocolate mb-2">{brand.name}</h2>
            {brand.description && (
              <p className="text-gray-600 text-center mb-2">{brand.description}</p>
            )}
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mb-2"
              >
                Visit Website
              </a>
            )}
            <h3 className="text-md font-semibold text-chocolate mt-4 mb-2">Collections</h3>
            <ul className="mb-2">
              {collections
                .filter(col => col.brand === brand.name)
                .map(col => (
                  <li key={col.id}>
                    <Link
                      href={`/collection/${col.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {col.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}