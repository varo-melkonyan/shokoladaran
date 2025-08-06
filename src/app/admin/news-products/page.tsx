"use client";
import { useState, useEffect } from "react";
import NewsProductsForm from "@/components/NewsProductsForm";
import { NewsProduct } from "@/types/newsProducts";
import { Product } from "@/types/product";
import { useTranslation } from "react-i18next";

export default function AdminNewsProducts() {
  const [newsProducts, setNewsProducts] = useState<NewsProduct[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<{ _id: string; name: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    fetch("/api/admin/brands")
  .then(res => res.json())
  .then(data => setBrands(data.map((b: any) => ({
    _id: b._id || b.id,
    name: b.name,
  }))));
    fetch("/api/admin/collection-types")
  .then(res => res.json())
  .then(data => setCollectionTypes(data.map((c: any) => ({
    _id: c._id || c.id,
    name_en: c.name_en,
    name_hy: c.name_hy,
    name_ru: c.name_ru,
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
    quantityType: p.quantityType || (p.weight ? "kg" : "piece"),
    readyAfter: p.readyAfter,
    ingredients: p.ingredients,
    shelfLife: p.shelfLife,
    nutritionFacts: p.nutritionFacts,
  }))));
    fetch("/api/admin/news-products").then(res => res.json()).then(setNewsProducts);
  }, [products]);

  const handleAddOrEdit = async (newNewsProduct: NewsProduct) => {
    if (editIndex !== null) {
      const oldId = newsProducts[editIndex]._id;
      await fetch(`/api/admin/news-products?id=${oldId}`, { method: "DELETE" });
      await fetch("/api/admin/news-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNewsProduct),
      });
      setEditIndex(null);
    } else {
      await fetch("/api/admin/news-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNewsProduct),
      });
    }
    // Refresh list
    const res = await fetch("/api/admin/news-products");
    const data = await res.json();
    setNewsProducts(data);
  };

  const saveOrder = async (newList: NewsProduct[]) => {
    await fetch("/api/admin/news-products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newsProducts: newList }),
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...newsProducts];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setNewsProducts(newList);
    saveOrder(newList);
  };

  const moveDown = (index: number) => {
    if (index === newsProducts.length - 1) return;
    const newList = [...newsProducts];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setNewsProducts(newList);
    saveOrder(newList);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/news-products?id=${id}`, { method: "DELETE" });
    const res = await fetch("/api/admin/news-products");
    const data = await res.json();
    setNewsProducts(data);
    setEditIndex(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">News Products</h1>
      <NewsProductsForm
        onAdd={handleAddOrEdit}
        initialData={editIndex !== null ? newsProducts[editIndex] : null}
        brands={brands}
        collectionTypes={collectionTypes}
        products={products}
      />
      <ul>
        {newsProducts.map((ep, idx) => (
          <li key={ep._id} className="flex items-center gap-2 border-b py-2">
            {ep.images && <img src={ep.images[0]} alt={ep.name_en} className="w-12 h-12 object-cover rounded" />}
            <span>{ep.name_en}</span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="text-blue-500 disabled:opacity-50"
                name="Move Up"
              >↑</button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === newsProducts.length - 1}
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