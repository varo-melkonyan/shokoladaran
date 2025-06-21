"use client";
import { useState, useEffect } from "react";

type Brand = {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  website?: string;
};

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // for showing problems

  useEffect(() => {
  fetch("/api/admin/brands")
    .then((res) => res.json())
    .then((data) => {
      const safeBrands = data.map((b: any) => ({
        _id: b._id || b.id || "",  // fallback to empty string
        name: b.name || "",
      })).filter(b => b._id && b._id.length === 24); // filter out bad ones
      setBrands(safeBrands);
    });
}, []);


  async function addBrand(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    if (editId) {
      const res = await fetch("/api/admin/brands", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, name }),
      });
      if (res.ok) {
        setBrands(brands.map(b => b._id === editId ? { ...b, name } : b));
        setEditId(null);
        setName("");
      } else {
        setError("Failed to update brand");
      }
    } else {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const newBrand = await res.json();
        if (!newBrand._id && !newBrand.id) {
          setError("New brand missing _id");
          return;
        }
        setBrands([
          ...brands,
          { _id: newBrand._id ?? newBrand.id, name: newBrand.name },
        ]);
        setName("");
      } else {
        setError("Failed to add brand");
      }
    }
  }

  function handleDeleteByName(name: string) {
  const brand = brands.find(b => b.name === name);
  const _id = brand?._id;

  // Validate ObjectId
  const isValidObjectId = (_id: string | undefined): boolean =>
    typeof _id === "string" && /^[0-9a-fA-F]{24}$/.test(_id);

  if (!isValidObjectId(_id)) {
    console.error("Invalid ID for deletion.");
    return;
  }

  fetch(`/api/admin/brands?id=${_id}`, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to delete");
      setBrands((prev) => prev.filter((b) => b._id !== _id));
    })
    .catch((err) => {
      console.error("Delete error:", err);
    });
}


  function startEdit(brand: Brand) {
    setEditId(brand._id);
    setName(brand.name);
  }

  function cancelEdit() {
    setEditId(null);
    setName("");
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Brands</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={addBrand} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-chocolate text-white px-4 py-2 rounded">
          {editId ? "Save" : "Add"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <ul>
        {brands.map(b => (
  <li key={b._id} className="flex justify-between items-center border-b py-2">
    <span>{b.name}</span>
    <div className="flex gap-2">
      <button onClick={() => startEdit(b)} className="text-blue-500">Edit</button>
      <button onClick={() => handleDeleteByName(b.name)} className="text-red-500">Delete</button>
    </div>
  </li>
))}
      </ul>
    </div>
  );
}
