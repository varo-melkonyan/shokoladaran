"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { ExclusivesProduct } from "@/types/exclusivesProduct";
import { Product } from "@/types/product";

type Props = {
  onAdd: (newExclusivesProduct: ExclusivesProduct) => void;
  initialData: ExclusivesProduct | null;
  brands: { _id: string; name: string }[];
  collectionTypes: { _id: string; name: string }[];
  products: Product[];
};

export default function ExclusivesProductsForm({
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
      onAdd({ ...product, image: product.image || "", link: product.link || "" });
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
          <option key={b._id} value={b.name}>{b.name}</option>
        ))}
      </select>
      <select value={selectedCollectionType} onChange={e => setSelectedCollectionType(e.target.value)}>
        <option value="">Select Collection Type</option>
        {collectionTypes.map(c => (
          <option key={c._id} value={c.name}>{c.name}</option>
        ))}
      </select>
      <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}>
        <option value="">Select Product</option>
        {filteredProducts.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>
      <button type="submit" className="bg-chocolate text-white px-4 py-2 rounded">
        Add to Exclusives Products
      </button>
    </form>
  );
}