"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";

interface Props {
  onAdd: (newGift: Product) => void;
  initialData: Product | null;
  brands: { _id: string; name: string }[];
  products: Product[];
}

export default function GiftsForm({
  onAdd,
  initialData,
  brands,
}: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState("");
  const [status, setStatus] = useState<"in_stock" | "out_of_stock" | "pre_order">("in_stock");
  const [readyAfter, setReadyAfter] = useState("");
  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPrice(initialData.price?.toString() || "");
      setDiscount(initialData.discount?.toString() || "");
      setBrand(initialData.brand || "");
      setWeight(initialData.weight || "");
      setStatus((initialData.status as "in_stock" | "out_of_stock" | "pre_order") || "in_stock");
      setReadyAfter(initialData.readyAfter || "");
      setImage(initialData.image || "");
      setImageFile(null);
    } else {
      setName("");
      setPrice("");
      setDiscount("");
      setBrand("");
      setWeight("");
      setStatus("in_stock");
      setReadyAfter("");
      setImage("");
      setImageFile(null);
    }
  }, [initialData]);

  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price || !brand || !weight) {
      setError("Name, price, brand, and weight are required.");
      return;
    }

    let imageUrl = image;
    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (!uploaded) {
        setError("Image upload failed.");
        return;
      }
      imageUrl = uploaded;
      setImage(imageUrl);
    }

    const newGift: Product = {
      _id: "", // Will be set by backend
      name,
      price: Number(price),
      weight,
      discount: discount ? Number(discount) : undefined,
      brand,
      collectionType: "Gift",
      status,
      readyAfter: status === "pre_order" ? readyAfter : "",
      image: imageUrl,
    };
    onAdd(newGift);
    setName("");
    setPrice("");
    setDiscount("");
    setBrand("");
    setWeight("");
    setStatus("in_stock");
    setReadyAfter("");
    setImage("");
    setImageFile(null);
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Gift Name"
        className="border p-2 rounded"
      />
      <input
        value={price}
        onChange={e => setPrice(e.target.value)}
        placeholder="Price (AMD)"
        type="number"
        className="border p-2 rounded"
      />
      <input
        value={discount}
        onChange={e => setDiscount(e.target.value)}
        placeholder="Discounted Price (optional)"
        type="number"
        className="border p-2 rounded"
      />
      <input
        value={weight}
        onChange={e => setWeight(e.target.value)}
        placeholder="Weight (e.g. 100g)"
        className="border p-2 rounded"
      />
      <select value={brand} onChange={e => setBrand(e.target.value)} className="border p-2 rounded">
        <option value="">Select Brand</option>
        {brands.map(b => (
          <option key={b._id} value={b.name}>{b.name}</option>
        ))}
      </select>
      <select
        value={status}
        onChange={e => {
          const value = e.target.value as "in_stock" | "out_of_stock" | "pre_order";
          setStatus(value);
          if (value !== "pre_order") setReadyAfter("");
        }}
        className="border p-2 rounded"
      >
        <option value="in_stock">In Stock</option>
        <option value="out_of_stock">No Product</option>
        <option value="pre_order">Pre Order</option>
      </select>
      {status === "pre_order" && (
        <input
          value={readyAfter}
          onChange={e => setReadyAfter(e.target.value)}
          placeholder="Ready after (e.g. 2 days, 1 week)"
          className="border p-2 rounded"
        />
      )}
      <input
        type="file"
        accept="image/png"
        onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.type !== "image/png") {
            setError("Image must be PNG");
            return;
          }
          setError("");
          setImageFile(file);
          const reader = new FileReader();
          reader.onload = (ev) => setImage(ev.target?.result as string);
          reader.readAsDataURL(file);
        }}
        className="border p-2 rounded"
      />
      {image && (
        <img src={image} alt="Preview" className="w-32 h-32 object-cover rounded" />
      )}
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="bg-chocolate text-white px-4 py-2 rounded">
        {initialData ? "Save Gift" : "Add Gift"}
      </button>
    </form>
  );
}