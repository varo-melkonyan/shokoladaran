"use client";
import { useEffect, useState } from "react";

type RecommendedByCollection = { [collectionType: string]: string[] };

export default function AdminRecommendationsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [recommended, setRecommended] = useState<RecommendedByCollection>({});
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

  const productsByCollection: { [collectionType: string]: any[] } = {};
  products.forEach((p: any) => {
    if (!productsByCollection[p.collectionType]) {
      productsByCollection[p.collectionType] = [];
    }
    productsByCollection[p.collectionType].push(p);
  });

  // Add a product to recommendations for a collection type
  const handleAddRecommendation = (collectionType: string, productId: string) => {
    setRecommended(prev => {
      const prevList = prev[collectionType] || [];
      if (prevList.includes(productId)) return prev; // already added
      return {
        ...prev,
        [collectionType]: [...prevList, productId],
      };
    });
  };

  // Remove a product from recommendations for a collection type
  const handleRemoveRecommendation = (collectionType: string, productId: string) => {
    setRecommended(prev => ({
      ...prev,
      [collectionType]: (prev[collectionType] || []).filter(id => id !== productId),
    }));
  };

  // Move a product up or down in the recommendations list
  const handleMoveRecommendation = (collectionType: string, productId: string, direction: "up" | "down") => {
    setRecommended(prev => {
      const list = prev[collectionType] || [];
      const idx = list.indexOf(productId);
      if (idx === -1) return prev;
      const newList = [...list];
      if (direction === "up" && idx > 0) {
        [newList[idx - 1], newList[idx]] = [newList[idx], newList[idx - 1]];
      }
      if (direction === "down" && idx < newList.length - 1) {
        [newList[idx + 1], newList[idx]] = [newList[idx], newList[idx + 1]];
      }
      return { ...prev, [collectionType]: newList };
    });
  };

  const handleSave = async () => {
    if (!selectedCollection) return;
    setSaving(true);
    await fetch("/api/admin/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: selectedCollection, // or another identifier if needed
        recommendedByCollection: recommended,
      }),
    });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleCancel = () => {
    setSelectedCollection("");
    setRecommended({});
    setSuccess(false);
  };

  // All products in the selected collection type
  const productsOfSelectedCollection = productsByCollection[selectedCollection] || [];

  useEffect(() => {
    if (!selectedCollection) return;
    setLoading(true);
    fetch(`/api/admin/recommendations?productId=${selectedCollection}`)
      .then(res => res.json())
      .then(data => {
        setRecommended((prev) => ({
          ...prev,
          [selectedCollection]: data?.recommendedByCollection?.[selectedCollection] || [],
        }));
      })
      .catch(() => setRecommended((prev) => ({
        ...prev,
        [selectedCollection]: [],
      })))
      .finally(() => setLoading(false));
  }, [selectedCollection]);

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
            onChange={e => setSelectedBrand(e.target.value)}
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
            onChange={e => setSelectedCollection(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Choose Collection --</option>
            {collections.map((c: any) => (
              <option key={c._id} value={c.name_en}>{c.name_en}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Show products and recommendations for the selected collection type */}
      {selectedCollection && (
        <div className="mb-6">
          <label className="font-semibold">Manage Recommendations for "{selectedCollection}":</label>
          <div className="flex flex-col gap-4 mt-2">
            {/* Current recommendations list */}
            <ul className="flex flex-wrap gap-2 mt-2">
              {(recommended[selectedCollection] || []).map((productId, idx, arr) => {
                const p = products.find(prod => prod._id === productId);
                if (!p) return null;
                return (
                  <li key={productId} className="flex items-center gap-2 bg-green-50 rounded px-2 py-1">
                    {p.image && (
                      <img src={p.image} alt={p.name_en} className="w-6 h-6 object-cover rounded" />
                    )}
                    <span>{p.name_en}</span>
                    <button
                      className="text-xs text-red-600 ml-1"
                      onClick={() => handleRemoveRecommendation(selectedCollection, productId)}
                      title="Remove"
                    >✕</button>
                    <button
                      className="text-xs ml-1"
                      disabled={idx === 0}
                      onClick={() => handleMoveRecommendation(selectedCollection, productId, "up")}
                      title="Move up"
                    >↑</button>
                    <button
                      className="text-xs ml-1"
                      disabled={idx === arr.length - 1}
                      onClick={() => handleMoveRecommendation(selectedCollection, productId, "down")}
                      title="Move down"
                    >↓</button>
                  </li>
                );
              })}
              {(!recommended[selectedCollection] || recommended[selectedCollection].length === 0) && (
                <li className="text-gray-500">No recommendations for this collection.</li>
              )}
            </ul>
            {/* All products in this collection type with Add button */}
            <div className="mt-4">
              <div className="font-semibold mb-2">All products in "{selectedCollection}":</div>
              <ul className="flex flex-wrap gap-2">
                {productsOfSelectedCollection.map((p: any) => {
                  const alreadyRecommended = (recommended[selectedCollection] || []).includes(p._id);
                  return (
                    <li key={p._id} className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1">
                      {p.image && (
                        <img src={p.image} alt={p.name} className="w-6 h-6 object-cover rounded" />
                      )}
                      <span>{p.name}</span>
                      <button
                        className="text-xs ml-1 bg-chocolate text-white px-2 py-1 rounded disabled:opacity-50"
                        disabled={alreadyRecommended}
                        onClick={() => handleAddRecommendation(selectedCollection, p._id)}
                      >
                        {alreadyRecommended ? "Added" : "Add"}
                      </button>
                    </li>
                  );
                })}
                {productsOfSelectedCollection.length === 0 && (
                  <li className="text-gray-500">No products in this collection.</li>
                )}
              </ul>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
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
        </div>
      )}
    </div>
  );
}