"use client";
import { useEffect, useState } from "react";

export default function AdminRecommendationsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [recommended, setRecommended] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products, brands, and collections
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/products").then(res => res.json()),
      fetch("/api/admin/brands").then(res => res.json()),
      fetch("/api/admin/collection-types").then(res => res.json()),
    ])
      .then(([products, brands, collections]) => {
        setProducts(products);
        setBrands(brands);
        setCollections(collections);
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  // Fetch recommendations for selected product
  useEffect(() => {
    if (!selectedProduct) return;
    fetch(`/api/admin/recommendations?productId=${selectedProduct}`)
      .then(res => res.json())
      .then(data => setRecommended(data?.recommendedProductIds || []))
      .catch(() => setRecommended([]));
  }, [selectedProduct]);

  // Filter products by brand and collection
  const filteredProducts = products.filter(
    (p: any) =>
      (!selectedBrand || p.brand === selectedBrand) &&
      (!selectedCollection || p.collectionType === selectedCollection)
  );

  const handleSave = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    await fetch("/api/admin/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: selectedProduct, recommendedProductIds: recommended }),
    });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleCancel = () => {
    setSelectedProduct("");
    setRecommended([]);
    setSuccess(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin: Product Recommendations</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="font-semibold">Brand:</label>
          <select
            className="border p-2 rounded ml-2"
            value={selectedBrand}
            onChange={e => {
              setSelectedBrand(e.target.value);
              setSelectedProduct("");
            }}
            disabled={loading}
          >
            <option value="">All Brands</option>
            {brands.map((b: any) => (
              <option key={b._id} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold">Collection:</label>
          <select
            className="border p-2 rounded ml-2"
            value={selectedCollection}
            onChange={e => {
              setSelectedCollection(e.target.value);
              setSelectedProduct("");
            }}
            disabled={loading}
          >
            <option value="">All Collections</option>
            {collections.map((c: any) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-6">
        <label className="font-semibold">Select Product:</label>
        <select
          className="border p-2 rounded ml-2"
          value={selectedProduct}
          onChange={e => setSelectedProduct(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Choose --</option>
          {filteredProducts.map((p: any) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>
      {selectedProduct && (
        <>
          <div className="mb-6">
            <label className="font-semibold">Select Recommended Products:</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {products
                .filter(p => p._id !== selectedProduct)
                .map(p => (
                  <label key={p._id} className="flex items-center gap-2 bg-gray-50 rounded p-2">
                    <input
                      type="checkbox"
                      checked={recommended.includes(p._id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setRecommended(ids => [...ids, p._id]);
                        } else {
                          setRecommended(ids => ids.filter(id => id !== p._id));
                        }
                      }}
                    />
                    {p.image && (
                      <img src={p.image} alt={p.name} className="w-8 h-8 object-cover rounded" />
                    )}
                    <span>{p.name}</span>
                  </label>
                ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              className="bg-chocolate text-white px-6 py-2 rounded font-bold"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Recommendations"}
            </button>
            <button
              className="bg-gray-200 text-chocolate px-6 py-2 rounded font-bold"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
          {success && (
            <div className="mt-4 text-green-600 font-semibold">Recommendations saved!</div>
          )}
          <div className="mt-8">
            <h2 className="font-bold mb-2">Current Recommendations:</h2>
            <ul className="flex flex-wrap gap-4">
              {products
                .filter(p => recommended.includes(p._id))
                .map(p => (
                  <li key={p._id} className="flex items-center gap-2 bg-green-50 rounded px-2 py-1">
                    {p.image && (
                      <img src={p.image} alt={p.name} className="w-6 h-6 object-cover rounded" />
                    )}
                    <span>{p.name}</span>
                  </li>
                ))}
              {recommended.length === 0 && <li className="text-gray-500">No recommendations selected.</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}