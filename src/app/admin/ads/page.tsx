"use client";
import { useState, useEffect } from "react";

type Ad = {
  _id: string;
  images: string[]; // <-- Array of image URLs
  link?: string;
  place: string; // "news", "exclusives", etc.
};

const PLACES = [
  { value: "news", label: "Before News" },
  { value: "exclusives", label: "Before Exclusives" },
];

export default function AdminAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [form, setForm] = useState<{ images: string[]; link?: string; place: string }>({ images: [], place: PLACES[0].value });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    fetch("/api/admin/ads")
      .then(res => res.json())
      .then(setAds);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrls: string[] = form.images;

    if (files.length > 0) {
      imageUrls = [];
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        imageUrls.push(result.url);
      }
    }

    const payload = { ...form, images: imageUrls };

    if (editIndex !== null) {
      await fetch(`/api/admin/ads?id=${ads[editIndex]._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    const res = await fetch("/api/admin/ads");
    setAds(await res.json());
    setForm({ images: [], place: PLACES[0].value });
    setEditIndex(null);
    setFiles([]);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/ads?id=${id}`, { method: "DELETE" });
    const res = await fetch("/api/admin/ads");
    setAds(await res.json());
    setEditIndex(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Ads Admin</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
        <select
          value={form.place}
          onChange={e => setForm(f => ({ ...f, place: e.target.value }))}
          className="border p-2 rounded"
        >
          {PLACES.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => {
            if (e.target.files) {
              setFiles(Array.from(e.target.files).slice(0, 3)); // max 3 images
            }
          }}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Link (optional)"
          value={form.link || ""}
          onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-chocolate text-white px-4 py-2 rounded">
          {editIndex !== null ? "Update Ad" : "Add Ad"}
        </button>
        {editIndex !== null && (
          <button type="button" onClick={() => { setEditIndex(null); setForm({ images: [], place: PLACES[0].value }); setFiles([]); }} className="text-gray-500 mt-2">
            Cancel Edit
          </button>
        )}
      </form>
      <ul>
        {ads.map((ad, idx) => (
          <li key={ad._id} className="flex items-center gap-2 border-b py-2">
            {ad.images.map((img, i) => (
              <img key={i} src={img} alt="Ad" className="w-16 h-16 object-cover rounded" />
            ))}
            <span className="text-xs text-gray-400">{ad.link}</span>
            <span className="text-xs text-gray-500 ml-2">Place: {PLACES.find(p => p.value === ad.place)?.label || ad.place}</span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => { setEditIndex(idx); setForm(ad); setFiles([]); }}
                className="text-green-600"
              >Edit</button>
              <button
                onClick={() => handleDelete(ad._id)}
                className="text-red-500"
              >✕</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}