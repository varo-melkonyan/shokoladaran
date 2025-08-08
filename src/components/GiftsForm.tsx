"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";

interface Props {
  onAdd: (newGift: Omit<Product, "_id">) => void;
  initialData: Product | null;
  brands: { _id: string; name_en: string; name_hy: string; name_ru: string }[];
  products: Product[];
}

export default function GiftsForm({
  onAdd,
  initialData,
  brands,
}: Props) {
  const [name_en, setNameEn] = useState("");
  const [name_hy, setNameHy] = useState("");
  const [name_ru, setNameRu] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState("");
  const [status, setStatus] = useState<"in_stock" | "out_of_stock" | "pre_order">("in_stock");
  const [readyAfter, setReadyAfter] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [stockCount, setStockCount] = useState(0);
  const [quantityType, setQuantityType] = useState<"pieces" | "kg">("pieces");

  useEffect(() => {
    if (initialData) {
      setNameEn(initialData.name_en || "");
      setNameHy(initialData.name_hy || "");
      setNameRu(initialData.name_ru || "");
      setPrice(initialData.price?.toString() || "");
      setDiscount(initialData.discount?.toString() || "");
      setBrand(initialData.brand || "");
      setWeight(initialData.weight || "");
      setStatus(initialData.status || "in_stock");
      setReadyAfter(initialData.readyAfter || "");
      setImages(initialData.images || []);
      setImageFiles([]);
      setStockCount(initialData.stockCount ?? 0);
      setQuantityType((initialData.quantityType as "pieces" | "kg") ?? "pieces");
    } else {
      setNameEn("");
      setNameHy("");
      setNameRu("");
      setPrice("");
      setDiscount("");
      setBrand("");
      setWeight("");
      setStatus("in_stock");
      setReadyAfter("");
      setImages([]);
      setImageFiles([]);
      setStockCount(0);
      setQuantityType("pieces");
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
    if (!name_en || !price || !brand || !weight) {
      setError("Name, price, brand, and weight are required.");
      return;
    }

    let imageUrls = images;
    if (imageFiles.length > 0) {
      const uploaded = await Promise.all(imageFiles.map(uploadImage));
      if (uploaded.includes(null)) {
        setError("Image upload failed.");
        return;
      }
      imageUrls = uploaded.filter((url): url is string => !!url);
      setImages(imageUrls);
    }

    const newGift = {
      name_en,
      name_hy,
      name_ru,
      price: Number(price),
      weight,
      discount: discount ? Number(discount) : undefined,
      brand,
      collectionType: "Gift",
      status,
      readyAfter: status === "pre_order" ? readyAfter : "",
      images: imageUrls,
      stockCount,
      quantityType,
    };
    onAdd(newGift);
    setNameEn("");
    setNameHy("");
    setNameRu("");
    setPrice("");
    setDiscount("");
    setBrand("");
    setWeight("");
    setStatus("in_stock");
    setReadyAfter("");
    setImages([]);
    setImageFiles([]);
    setStockCount(0);
    setQuantityType("pieces");
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
      <input
        value={name_en}
        onChange={e => setNameEn(e.target.value)}
        placeholder="Gift Name (EN)"
        className="border p-2 rounded"
      />
      <input
        value={name_hy}
        onChange={e => setNameHy(e.target.value)}
        placeholder="Gift Name (HY)"
        className="border p-2 rounded"
      />
      <input
        value={name_ru}
        onChange={e => setNameRu(e.target.value)}
        placeholder="Gift Name (RU)"
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
          <option key={b._id} value={b.name_en}>{b.name_en}</option>
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
          setImageFiles(prev => [...prev, file]);
          const reader = new FileReader();
          reader.onload = (ev) => setImages(prev => [...prev, ev.target?.result as string]);
          reader.readAsDataURL(file);
        }}
        className="border p-2 rounded"
      />
      {images.length > 0 && (
        <div className="flex gap-2">
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Preview ${index}`} className="w-32 h-32 object-cover rounded" />
          ))}
        </div>
      )}
      <input
        value={stockCount}
        onChange={e => setStockCount(Number(e.target.value))}
        placeholder="Stock Count"
        type="number"
        className="border p-2 rounded"
      />
      <select
        value={quantityType}
        onChange={e => setQuantityType(e.target.value as "pieces" | "kg")}
        className="border p-2 rounded"
      >
        <option value="pieces">Pieces</option>
        <option value="kg">Kilograms</option>
      </select>
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="bg-chocolate text-white px-4 py-2 rounded">
        {initialData ? "Save Gift" : "Add Gift"}
      </button>
    </form>
  );
}