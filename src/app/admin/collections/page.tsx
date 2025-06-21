"use client";
import { useState, useEffect } from "react";

type CollectionType = {
  _id: string;
  name: string;
  type: string;
};

export default function AdminCollectionTypes() {
  const [collectionTypes, setCollectionTypes] = useState<CollectionType[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("collection");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/collection-types")
      .then(res => res.json())
      .then(data =>
        setCollectionTypes(
          data.map((c: any) => ({
            _id: c._id || c.id,
            name: c.name,
            type: c.type,
          }))
        )
      );
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
          .then(data =>
            setCollectionTypes(
              data.map((c: any) => ({
                _id: c._id || c.id,
                name: c.name,
                type: c.type,
              }))
            )
          );
      });
  }

  function handleEdit(collectionType: CollectionType) {
    setEditId(collectionType._id);
    setName(collectionType.name);
  }

  function handleDelete(_id: string | undefined) {
    if (!_id || _id === "undefined") {
      alert("Invalid ID");
      return;
    }
    fetch(`/api/admin/collection-types/${_id}`, {
      method: "DELETE",
    }).then(() => {
      setCollectionTypes(collectionTypes.filter(ct => ct._id !== _id));
      if (editId === _id) {
        setEditId(null);
        setName("");
        setType("collection");
      }
    });
  }

  function handleCancelEdit() {
    setEditId(null);
    setName("");
    setType("collection");
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Collection Types</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6 bg-white p-4 rounded shadow">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 rounded"
          required
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="collection">Collection Type</option>
          <option value="children">Children's Type</option>
          <option value="dietary">Dietary Type</option>
        </select>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-chocolate text-white px-4 py-2 rounded"
          >
            {editId ? "Save" : "Add"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="divide-y divide-gray-200 bg-white rounded shadow">
        {collectionTypes.map(ct => (
          <li
            key={ct._id}
            className={`flex items-center justify-between px-4 py-3 ${editId === ct._id ? "bg-yellow-50" : ""}`}
          >
            <div>
              <div className="font-semibold">{ct.name}</div>
              <div className="text-xs text-gray-500">{ct.type}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(ct)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(ct._id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}