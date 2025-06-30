"use client";
import { useState, useEffect } from "react";
import BestSellerProductsForm from "@/components/BestSellersForm";
import { BestSellerProduct } from "@/types/bestSellersProduct";
import { Product } from "@/types/product";

export default function AdminBestSellerProducts() {
  const [bestSellerProducts, setBestSellerProducts] = useState<BestSellerProduct[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<{ _id: string; name: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

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
        name: c.name,
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
        image: p.image,
        link: p.link,
        status: p.status,
        readyAfter: p.readyAfter,
        ingredients: p.ingredients,
        shelfLife: p.shelfLife,
        nutritionFacts: p.nutritionFacts,
      }))));
    fetch("/api/admin/best-sellers")
      .then(res => res.json())
      .then(setBestSellerProducts);
  }, []);

  const handleAddOrEdit = async (newBestSellerProduct: BestSellerProduct) => {
    // Always find by _id
    const product = products.find(p => p._id === newBestSellerProduct._id);
    if (!product) return;

    // Ensure required fields are always strings
    const productWithDiscount: BestSellerProduct = {
      ...product,
      discount: product.discount ?? undefined,
      image: product.image || "",
      link: product.link || "",
    };

    if (editIndex !== null) {
      const oldId = bestSellerProducts[editIndex]._id;
      await fetch(`/api/admin/best-sellers?id=${oldId}`, { method: "DELETE" });
      await fetch("/api/admin/best-sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productWithDiscount),
      });
      setEditIndex(null);
    } else {
      await fetch("/api/admin/best-sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productWithDiscount),
      });
    }
    // Refresh list
    const res = await fetch("/api/admin/best-sellers");
    const data = await res.json();
    setBestSellerProducts(data);
  };

  const saveOrder = async (newList: BestSellerProduct[]) => {
    await fetch("/api/admin/best-sellers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bestSellersProducts: newList }),
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...bestSellerProducts];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setBestSellerProducts(newList);
    saveOrder(newList);
  };

  const moveDown = (index: number) => {
    if (index === bestSellerProducts.length - 1) return;
    const newList = [...bestSellerProducts];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setBestSellerProducts(newList);
    saveOrder(newList);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/best-sellers?id=${id}`, { method: "DELETE" });
    const res = await fetch("/api/admin/best-sellers");
    const data = await res.json();
    setBestSellerProducts(data);
    setEditIndex(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">BestSeller Products</h1>
      <BestSellerProductsForm
        onAdd={handleAddOrEdit}
        initialData={editIndex !== null ? bestSellerProducts[editIndex] : null}
        brands={brands}
        collectionTypes={collectionTypes}
        products={products}
      />
      <ul>
        {bestSellerProducts.map((ep, idx) => (
          <li key={ep.name + idx} className="flex items-center gap-2 border-b py-2">
            {ep.image && <img src={ep.image} alt={ep.name} className="w-12 h-12 object-cover rounded" />}
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
                disabled={idx === bestSellerProducts.length - 1}
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