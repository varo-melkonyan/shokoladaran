"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { NewsProduct } from "@/types/newsProducts";
import { Product } from "@/types/product";

interface Props  {
  onAdd: (newNewsProduct: NewsProduct) => void;
  initialData: NewsProduct | null;
  brands: { _id: string; name_en: string; name_hy: string; name_ru: string }[];
  collectionTypes: { _id: string; name_en: string; name_hy: string; name_ru: string }[];
  products: Product[];
};

export default function NewsProductsForm({
  onAdd,
  initialData,
  brands,
  collectionTypes,
  products,
}: Props) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCollectionType, setSelectedCollectionType] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  // Filter products by selected brand and collection type
  const filteredProducts = products.filter(
    p =>
      (!selectedBrand || p.brand === selectedBrand) &&
      (!selectedCollectionType || p.collectionType === selectedCollectionType)
  );

  useEffect(() => {
    setSelectedBrand("");
    setSelectedCollectionType("");
    setSelectedProductId("");
  }, [initialData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const product = products.find(p => p._id === selectedProductId);
    if (product) {
      onAdd({
        ...product,
        images: product.images ?? [],
        link: product.link ?? "",
      });
      setSelectedBrand("");
      setSelectedCollectionType("");
      setSelectedProductId("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
      <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
        <option value="">Select Brand</option>
        {brands.map(b => (
          <option key={b._id} value={b.name_en}>{b.name_en}</option>
        ))}
      </select>
      <select value={selectedCollectionType} onChange={e => setSelectedCollectionType(e.target.value)}>
        <option value="">Select Collection Type</option>
        {collectionTypes.map(c => (
          <option key={c._id} value={c.name_en}>{c.name_en}</option>
        ))}
      </select>
      <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}>
        <option value="">Select Product</option>
        {filteredProducts.map(p => (
          <option key={p._id} value={p._id}>{p.name_en}</option>
        ))}
      </select>
      <button type="submit" className="bg-chocolate text-white px-4 py-2 rounded">
        Add to News Products
      </button>
    </form>
  );
}