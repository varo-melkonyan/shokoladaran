"use client";
import { useState, useEffect } from "react";

export default function AdminCollectionTypes() {
  const [collectionTypes, setCollectionTypes] = useState<{ id: string; name: string; type: string }[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("collection");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/collection-types")
      .then(res => res.json())
      .then(data => setCollectionTypes(data));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    fetch("/api/admin/collection-types", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, name, type }),
    })
      .then(res => res.json())
      .then(() => {
        setName("");
        setType("collection");
        setEditId(null);
        fetch("/api/admin/collection-types")
          .then(res => res.json())
          .then(data => setCollectionTypes(data));
      });
  }

  function handleEdit(ct: { id: string; name: string; type: string }) {
    setEditId(ct.id);
    setName(ct.name);
    setType(ct.type);
  }

  function handleDelete(id: string) {
    fetch(`/api/admin/collection-types?id=${id}`, { method: "DELETE" })
      .then(() => {
        setCollectionTypes(collectionTypes.filter(ct => ct.id !== id));
      });
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Collection Types</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border p-2 rounded" />
        <select value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded">
          <option value="collection">Collection Type</option>
          <option value="children">Children's Type</option>
          <option value="dietary">Dietary Type</option>
        </select>
        <button type="submit" className="bg-chocolate text-white px-4 py-2 rounded">
          {editId ? "Save" : "Add"}
        </button>
      </form>
      <ul>
        {collectionTypes.map(ct => (
          <li key={ct.id} className="flex justify-between items-center border-b py-2">
            <span>
  {ct.name} (
    {ct.type === "collection"
      ? "Collection Type"
      : ct.type === "dietary"
      ? "Dietary Type"
      : ct.type === "children"
      ? "Children's Type"
      : ct.type}
  )
</span>
            <div>
              <button onClick={() => handleEdit(ct)} className="text-blue-500 mr-2">Edit</button>
              <button onClick={() => handleDelete(ct.id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}