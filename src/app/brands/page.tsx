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
  _id: string;
  name: string;
  brand: string;
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/brands")
        .then(res => res.json())
        .then(data => setBrands(data.map((b: any) => ({
          _id: b._id || b.id,
          name: b.name,
          image: b.image,
          description: b.description,
          website: b.website,
        })))),
      fetch("/api/admin/collection-types")
        .then(res => res.json())
        .then(data => setCollections(data.map((c: any) => ({
          _id: c._id || c.id,
          name: c.name,
          brand: c.brand,
        }))))
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-12">Loading...</div>;

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-chocolate mb-8">Brands</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {brands.map((brand) => (
          <div key={brand._id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <Link href={`/brands/${brand.name.toLowerCase()}`} className="flex flex-col items-center w-full">
              {brand.image && (
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-24 h-24 object-cover rounded-full mb-4"
                />
              )}
              <h2 className="text-xl font-bold text-chocolate mb-2 hover:underline">{brand.name}</h2>
            </Link>
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
          </div>
        ))}
      </div>
    </main>
  );
}