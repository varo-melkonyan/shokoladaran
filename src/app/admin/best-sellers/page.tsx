"use client";
import { useState, useEffect } from "react";
import BestSellersForm from "@/components/BestSellersForm";
import { BestSeller } from "@/types/bestSeller";
import { Product } from "@/types/product";

export default function AdminBestSellers() {
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<{ id: string; name: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then(res => res.json())
      .then(setBrands);
    fetch("/api/admin/collection-types")
      .then(res => res.json())
      .then(setCollectionTypes);
    fetch("/api/admin/products")
      .then(res => res.json())
      .then(setProducts);
    fetch("/api/admin/best-sellers")
      .then(res => res.json())
      .then(setBestSellers);
  }, []);

  const handleAddOrEdit = async (newBestSeller: BestSeller) => {
    // Find the full product info by id (or by title if that's all you have)
    const product = products.find(
      p => p.id === newBestSeller.id || p.name === newBestSeller.name
    );
    // If found, use the full product object; otherwise, fallback to the form data
    const bestSellerData = product ? { ...product } : newBestSeller;

    if (editIndex !== null) {
      await fetch("/api/admin/best-sellers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: editIndex, ...bestSellerData }),
      });
      const updated = [...bestSellers];
      updated[editIndex] = bestSellerData;
      setBestSellers(updated);
      setEditIndex(null);
    } else {
      await fetch("/api/admin/best-sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bestSellerData),
      });
      setBestSellers([...bestSellers, bestSellerData]);
    }
  };

  const handleDelete = async (index: number) => {
    await fetch(`/api/admin/best-sellers?index=${index}`, { method: "DELETE" });
    setBestSellers(bestSellers.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null);
  };

  const saveOrder = async (newList: BestSeller[]) => {
    await fetch("/api/admin/best-sellers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bestSellers: newList }),
    });
  };
  
  const moveUp = (index: number) => {
  if (index === 0) return;
  const newList = [...bestSellers];
  [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
  setBestSellers(newList);
  saveOrder(newList);
};

const moveDown = (index: number) => {
  if (index === bestSellers.length - 1) return;
  const newList = [...bestSellers];
  [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
  setBestSellers(newList);
  saveOrder(newList);
};

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Best Sellers</h1>
      <BestSellersForm
        onSubmit={handleAddOrEdit}
        initialData={editIndex !== null ? bestSellers[editIndex] : null}
        brands={brands}
        collectionTypes={collectionTypes}
        products={products}
      />
      <ul>
  {bestSellers.map((bs, index) => (
    <li key={bs.id || bs.name + index} className="flex items-center justify-between border-b py-2 bg-white">
      <div className="flex items-center gap-3">
        {bs.image && (
          <img
            src={bs.image}
            alt={bs.name}
            className="w-12 h-12 object-cover rounded"
          />
        )}
        <span>{bs.name}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => moveUp(index)}
          disabled={index === 0}
          className="text-blue-500 disabled:opacity-50"
          title="Move Up"
        >↑</button>
        <button
          onClick={() => moveDown(index)}
          disabled={index === bestSellers.length - 1}
          className="text-blue-500 disabled:opacity-50"
          title="Move Down"
        >↓</button>
        <button
          onClick={() => handleDelete(index)}
          className="text-red-500"
        >Delete</button>
      </div>
    </li>
  ))}
</ul>
    </div>
  );
}