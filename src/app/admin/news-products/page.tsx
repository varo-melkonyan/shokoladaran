"use client";
import { useState, useEffect } from "react";
import NewsProductsForm from "@/components/NewProductsForm";
import { NewsProduct } from "@/types/newsProducts";
import { Product } from "@/types/product";

export default function AdminNewsProducts() {
  const [newsProducts, setNewsProducts] = useState<NewsProduct[]>([]);
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
    image: p.image,
    link: p.link,
    status: p.status,
    ingredients: p.ingredients,
    shelfLife: p.shelfLife,
    nutritionFacts: p.nutritionFacts,
  }))));
    fetch("/api/admin/news-products")
      .then(res => res.json())
      .then(setNewsProducts);
  }, []);

  const handleAddOrEdit = async (newNewsProduct: NewsProduct) => {
    if (editIndex !== null) {
      await fetch("/api/admin/news-products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: editIndex, ...newNewsProduct }),
      });
      const updated = [...newsProducts];
      updated[editIndex] = newNewsProduct;
      setNewsProducts(updated);
      setEditIndex(null);
    } else {
      await fetch("/api/admin/news-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNewsProduct),
      });
      setNewsProducts([...newsProducts, newNewsProduct]);
    }
  };

  const handleDelete = async (index: number) => {
    await fetch(`/api/admin/news-products?index=${index}`, { method: "DELETE" });
    setNewsProducts(newsProducts.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null);
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
        {newsProducts.map((np, index) => (
          <li key={np.name + index} className="flex items-center justify-between border-b py-2 bg-white">
            <div className="flex items-center gap-3">
              {np.image && (
                <img
                  src={np.image}
                  alt={np.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <span>{np.name}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="text-blue-500 disabled:opacity-50"
                name="Move Up"
              >↑</button>
              <button
                onClick={() => moveDown(index)}
                disabled={index === newsProducts.length - 1}
                className="text-blue-500 disabled:opacity-50"
                name="Move Down"
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