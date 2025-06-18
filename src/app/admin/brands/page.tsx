"use client";
import { useState, useEffect } from "react";

type Brand = {
  id: string;
  name: string;
};

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then(res => res.json())
      .then(data => setBrands(data));
  }, []);

  async function addBrand(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      // Edit
      const res = await fetch("/api/admin/brands", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, name }),
      });
      if (res.ok) {
        setBrands(brands.map(b => b.id === editId ? { ...b, name } : b));
        setEditId(null);
        setName("");
      }
    } else {
      // Add
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const newBrand = await res.json();
        setBrands([...brands, newBrand]);
        setName("");
      }
    }
  }

  async function deleteBrand(id: string) {
    await fetch(`/api/admin/brands?id=${id}`, { method: "DELETE" });
    setBrands(brands.filter(b => b.id !== id));
    if (editId === id) {
      setEditId(null);
      setName("");
    }
  }

  function startEdit(brand: Brand) {
    setEditId(brand.id);
    setName(brand.name);
  }

  function cancelEdit() {
    setEditId(null);
    setName("");
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Brands</h1>
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
          <button type="button" onClick={cancelEdit} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </form>
      <ul>
        {brands.map(b => (
          <li key={b.id} className="flex justify-between items-center border-b py-2">
            <span>{b.name}</span>
            <div className="flex gap-2">
              <button onClick={() => startEdit(b)} className="text-blue-500">Edit</button>
              <button onClick={() => deleteBrand(b.id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}