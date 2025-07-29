"use client";
import { useState, useEffect } from "react";
import SpecialsForm from "@/components/SpecialsForm"; 
import { Product } from "@/types/product";

export default function AdminSpecials() {
  const [specials, setSpecials] = useState<Product[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then(res => res.json())
      .then(data => setBrands(data.map((b: any) => ({
        _id: b._id || b.id,
        name: b.name,
      }))));
    fetch("/api/admin/products")
      .then(res => res.json())
      .then(data => setProducts(data.map((p: any) => ({
        _id: p._id || p.id,
        name: p.name,
        price: p.price,
        weight: p.weight,
        discount: p.discount,
        collectionType: p.collectionType,
        brand: p.brand,
        images: p.image,
        link: p.link,
        status: p.status,
        readyAfter: p.readyAfter,
        ingredients: p.ingredients,
        shelfLife: p.shelfLife,
        nutritionFacts: p.nutritionFacts,
        stockCount: p.stockCount,
        quantityType: p.quantityType || "pieces",
      }))));
    fetch("/api/admin/special").then(res => res.json()).then(setSpecials);
  }, []);

  const handleAddOrEdit = async (newSpecial: Product) => {
    if (editIndex !== null) {
      const oldId = specials[editIndex]._id;
      await fetch(`/api/admin/special?id=${oldId}`, { method: "DELETE" });
      await fetch("/api/admin/special", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSpecial),
      });
      setEditIndex(null);
    } else {
      await fetch("/api/admin/special", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSpecial),
      });
    }
    // Refresh list
    const res = await fetch("/api/admin/special");
    const data = await res.json();
    setSpecials(data);
  };

  const saveOrder = async (newList: Product[]) => {
    await fetch("/api/admin/special", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specials: newList }),
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...specials];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setSpecials(newList);
    saveOrder(newList);
  };

  const moveDown = (index: number) => {
    if (index === specials.length - 1) return;
    const newList = [...specials];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setSpecials(newList);
    saveOrder(newList);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/special?id=${id}`, { method: "DELETE" });
    const res = await fetch("/api/admin/special");
    const data = await res.json();
    setSpecials(data);
    setEditIndex(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Special</h1>
      <SpecialsForm
        onAdd={handleAddOrEdit}
        initialData={editIndex !== null ? specials[editIndex] : null}
        brands={brands}
        products={products}
      />
      <ul>
        {specials.map((special, idx) => (
          <li key={special.name + idx} className="flex items-center gap-2 border-b py-2">
            {special.images && <img src={special.images[0]} alt={special.name} className="w-12 h-12 object-cover rounded" />}
            <span>{special.name}</span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="text-blue-500 disabled:opacity-50"
                name="Move Up"
              >↑</button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === specials.length - 1}
                className="text-blue-500 disabled:opacity-50"
                name="Move Down"
              >↓</button>
              <button
                onClick={() => setEditIndex(idx)}
                className="text-green-600"
                name="Edit"
              >Edit</button>
              <button
                onClick={() => handleDelete(special._id)}
                className="text-red-500"
                name="Delete"
              >✕</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}