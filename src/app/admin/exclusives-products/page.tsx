"use client";
import { useState, useEffect } from "react";
import ExclusivesProductsForm from "@/components/ExclusivesProductsForm";
import { ExclusivesProduct } from "@/types/exclusivesProduct";
import { Product } from "@/types/product";

export default function AdminExclusivesProducts() {
  const [exclusivesProducts, setExclusivesProducts] = useState<ExclusivesProduct[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<{ _id: string; name: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/admin/brands")
  .then(res => res.json())
  .then(data => setBrands(data.map((b: any) => ({
    _id: b._id || b.id, // use _id if present, else id
    name: b.name,
  }))));
    fetch("/api/admin/collection-types")
  .then(res => res.json())
  .then(data => setCollectionTypes(data.map((c: any) => ({
    _id: c._id || c.id,
    name: c.name,
  }))));
    fetch("/api/admin/products")
  .then(res => res.json())
  .then(data => setProducts(data.map((p: any) => ({
    _id: p._id || p.id, // use _id if present, else id
    name: p.name,
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
  }))));
    fetch("/api/admin/exclusives-products").then(res => res.json()).then(setExclusivesProducts);
  }, []);

  const handleAddOrEdit = async (newExclusivesProduct: ExclusivesProduct) => {
    if (editIndex !== null) {
      const oldId = exclusivesProducts[editIndex]._id;
      await fetch(`/api/admin/exclusives-products?id=${oldId}`, { method: "DELETE" });
      await fetch("/api/admin/exclusives-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExclusivesProduct),
      });
      setEditIndex(null);
    } else {
      await fetch("/api/admin/exclusives-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExclusivesProduct),
      });
    }
    // Refresh list
    const res = await fetch("/api/admin/exclusives-products");
    const data = await res.json();
    setExclusivesProducts(data);
  };

  const saveOrder = async (newList: ExclusivesProduct[]) => {
    await fetch("/api/admin/exclusives-products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exclusivesProducts: newList }),
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...exclusivesProducts];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setExclusivesProducts(newList);
    saveOrder(newList);
  };

  const moveDown = (index: number) => {
    if (index === exclusivesProducts.length - 1) return;
    const newList = [...exclusivesProducts];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setExclusivesProducts(newList);
    saveOrder(newList);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/exclusives-products?id=${id}`, { method: "DELETE" });
    const res = await fetch("/api/admin/exclusives-products");
    const data = await res.json();
    setExclusivesProducts(data);
    setEditIndex(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Exclusives Products</h1>
      <ExclusivesProductsForm
        onAdd={handleAddOrEdit}
        initialData={editIndex !== null ? exclusivesProducts[editIndex] : null}
        brands={brands}
        collectionTypes={collectionTypes}
        products={products}
      />
      <ul>
        {exclusivesProducts.map((ep, idx) => (
          <li key={ep.name + idx} className="flex items-center gap-2 border-b py-2">
            {ep.images && <img src={ep.images[0]} alt={ep.name} className="w-12 h-12 object-cover rounded" />}
            <span>{ep.name}</span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="text-blue-500 disabled:opacity-50"
                name="Move Up"
              >↑</button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === exclusivesProducts.length - 1}
                className="text-blue-500 disabled:opacity-50"
                name="Move Down"
              >↓</button>
              <button
                onClick={() => handleDelete(ep._id)}
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