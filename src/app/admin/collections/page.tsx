"use client";
import { useState, useEffect } from "react";

export default function AdminCollectionTypes() {
  const [collectionTypes, setCollectionTypes] = useState<{ _id: string; name: string; type: string }[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("collection");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/collection-types")
  .then(res => res.json())
  .then(data => setCollectionTypes(data.map((c: any) => ({
    _id: c._id || c.id,
    name: c.name,
  }))));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    fetch("/api/admin/collection-types", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editId ? { _id: editId, name, type } : { name, type }),
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

  function handleEdit(collectionType) {
    setEditId(collectionType._id);
    setName(collectionType.name);
    setType(collectionType.type);
  }

  function handleDelete(_id: string | undefined) {
  if (!_id || _id === "undefined") {
    alert("Invalid ID");
    return;
  }

  fetch(`/api/admin/collection-types/${_id}`, {
    method: "DELETE",
  })
    .then(() => {
      setCollectionTypes(collectionTypes.filter(ct => ct._id !== _id));
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
  <li key={ct._id}>
    {ct.name}
    <button onClick={() => handleDelete(ct._id)}>Delete</button>
  </li>
))}
      </ul>
    </div>
  );
}