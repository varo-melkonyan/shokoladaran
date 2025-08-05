"use client";
import { useState, useEffect } from "react";
import GiftsForm from "@/components/GiftsForm"; 
import { Product } from "@/types/product";

export default function AdminGifts() {
  const [gifts, setGifts] = useState<Product[]>([]);
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
        name_en: p.name_en,
        name_hy: p.name_hy,
        name_ru: p.name_ru,
        price: p.price,
        weight: p.weight,
        discount: p.discount,
        collectionType: p.collectionType,
        brand: p.brand,
        images: p.images,
        link: p.link,
        status: p.status,
        readyAfter: p.readyAfter,
        ingredients: p.ingredients,
        shelfLife: p.shelfLife,
        nutritionFacts: p.nutritionFacts,
        stockCount: p.stockCount,
        quantityType: p.quantityType || "pieces",
      }))));
    fetch("/api/admin/gifts").then(res => res.json()).then(setGifts);
  }, []);

  const handleAddOrEdit = async (newGift: Product) => {
    if (editIndex !== null) {
      const oldId = gifts[editIndex]._id;
      await fetch(`/api/admin/gifts?id=${oldId}`, { method: "DELETE" });
      await fetch("/api/admin/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGift),
      });
      setEditIndex(null);
    } else {
      await fetch("/api/admin/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGift),
      });
    }
    // Refresh list
    const res = await fetch("/api/admin/gifts");
    const data = await res.json();
    setGifts(data);
  };

  const saveOrder = async (newList: Product[]) => {
    await fetch("/api/admin/gifts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gifts: newList }),
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...gifts];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setGifts(newList);
    saveOrder(newList);
  };

  const moveDown = (index: number) => {
    if (index === gifts.length - 1) return;
    const newList = [...gifts];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setGifts(newList);
    saveOrder(newList);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/gifts?id=${id}`, { method: "DELETE" });
    const res = await fetch("/api/admin/gifts");
    const data = await res.json();
    setGifts(data);
    setEditIndex(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Gifts</h1>
      <GiftsForm
        onAdd={handleAddOrEdit}
        initialData={editIndex !== null ? gifts[editIndex] : null}
        brands={brands}
        products={products}
      />
      <ul>
        {gifts.map((gift, idx) => (
          <li key={gift.name_en + idx} className="flex items-center gap-2 border-b py-2">
            {gift.images && <img src={gift.images[0]} alt={gift.name_en} className="w-12 h-12 object-cover rounded" />}
            <span>{gift.name_en}</span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="text-blue-500 disabled:opacity-50"
                name="Move Up"
              >↑</button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === gifts.length - 1}
                className="text-blue-500 disabled:opacity-50"
                name="Move Down"
              >↓</button>
              <button
                onClick={() => setEditIndex(idx)}
                className="text-green-600"
                name="Edit"
              >Edit</button>
              <button
                onClick={() => handleDelete(gift._id)}
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