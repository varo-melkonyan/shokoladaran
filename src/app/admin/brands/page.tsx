"use client";
import { useState, useEffect } from "react";

type Brand = {
  _id: string;
  name_en: string;
  name_hy: string;
  name_ru: string;
  image?: string;
  description?: string;
  website?: string;
};

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name_en, setNameEn] = useState("");
  const [name_hy, setNameHy] = useState("");
  const [name_ru, setNameRu] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then((res) => res.json())
      .then((data) => {
        const safeBrands = data
          .map((b: any) => ({
            _id: b._id || b.id || "",
            name_en: b.name_en || "",
            name_hy: b.name_hy || "",
            name_ru: b.name_ru || "",
            image: b.image || "",
            description: b.description || "",
            website: b.website || "",
          }))
          .filter((b) => b._id && b._id.length === 24);
        setBrands(safeBrands);
      });
  }, []);

  async function addBrand(e: React.FormEvent) {
    e.preventDefault();
    if (!name_en || !name_hy || !name_ru) {
      setError("All language fields are required.");
      return;
    }
    setError(null);
    if (editId) {
      const res = await fetch("/api/admin/brands", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          name_en,
          name_hy,
          name_ru,
          image,
          description,
          website,
        }),
      });
      if (res.ok) {
        setBrands(
          brands.map((b) =>
            b._id === editId
              ? { ...b, name_en, name_hy, name_ru, image, description, website }
              : b
          )
        );
        cancelEdit();
      } else {
        setError("Failed to update brand");
      }
    } else {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_en,
          name_hy,
          name_ru,
          image,
          description,
          website,
        }),
      });
      if (res.ok) {
        const newBrand = await res.json();
        if (!newBrand._id && !newBrand.id) {
          setError("New brand missing _id");
          return;
        }
        setBrands([
          ...brands,
          {
            _id: newBrand._id ?? newBrand.id,
            name_en: newBrand.name_en,
            name_hy: newBrand.name_hy,
            name_ru: newBrand.name_ru,
            image: newBrand.image,
            description: newBrand.description,
            website: newBrand.website,
          },
        ]);
        cancelEdit();
      } else {
        setError("Failed to add brand");
      }
    }
  }

  function handleDeleteById(_id: string) {
    if (!_id || _id.length !== 24) {
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
    setNameEn(brand.name_en);
    setNameHy(brand.name_hy);
    setNameRu(brand.name_ru);
    setImage(brand.image || "");
    setDescription(brand.description || "");
    setWebsite(brand.website || "");
  }

  function cancelEdit() {
    setEditId(null);
    setNameEn("");
    setNameHy("");
    setNameRu("");
    setImage("");
    setDescription("");
    setWebsite("");
    setError(null);
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Brands</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={addBrand} className="flex flex-col gap-2 mb-6">
        <input
          value={name_en}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="Brand Name (EN)"
          className="border p-2 rounded"
        />
        <input
          value={name_hy}
          onChange={(e) => setNameHy(e.target.value)}
          placeholder="Brand Name (HY)"
          className="border p-2 rounded"
        />
        <input
          value={name_ru}
          onChange={(e) => setNameRu(e.target.value)}
          placeholder="Brand Name (RU)"
          className="border p-2 rounded"
        />
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
          className="border p-2 rounded"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 rounded"
        />
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Website Link"
          className="border p-2 rounded"
        />
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
              onClick={cancelEdit}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul>
        {brands.map((b) => (
          <li
            key={b._id}
            className="flex justify-between items-center border-b py-2"
          >
            <div className="flex items-center gap-3">
              {b.image && (
                <img src={b.image} alt={b.name_en} className="w-10 h-10 object-contain rounded" />
              )}
              <div>
                <div className="font-bold">{b.name_en}</div>
                <div className="font-bold">{b.name_hy}</div>
                <div className="font-bold">{b.name_ru}</div>
                {b.description && <div className="text-xs text-gray-500">{b.description}</div>}
                {b.website && (
                  <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">
                    {b.website}
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(b)} className="text-blue-500">Edit</button>
              <button onClick={() => handleDeleteById(b._id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}