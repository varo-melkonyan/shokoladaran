"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function randomBase64Id(length = 12) {
  return btoa(String(Math.random())).replace(/[^a-zA-Z0-9]/g, "").slice(0, length);
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<{ _id: string; name: string; type: string }[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [discount, setDiscount] = useState("");
  const [collectionType, setCollectionType] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState<"in_stock" | "out_of_stock">("in_stock");
  const [image, setImage] = useState(""); 
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientsInput, setIngredientsInput] = useState(""); 
  const [shelfLife, setShelfLife] = useState("");
  const [nutritionFacts, setNutritionFacts] = useState({
    energy: "",
    fat: "",
    carbohydrates: "",
    protein: "",
  });
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch products, brands, and collection types
  useEffect(() => {
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
        ingredients: p.ingredients,
        shelfLife: p.shelfLife,
        nutritionFacts: p.nutritionFacts,
      }))));
    fetch("/api/admin/brands")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((b: any) => ({
          _id: b._id || b.id,
          name: b.name,
        }));
        setBrands(mapped);
        // Set default brand if not editing
        if (!editId && mapped.length && !brand) setBrand(mapped[0].name);
      });
    fetch("/api/admin/collection-types")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((c: any) => ({
          _id: c._id || c.id,
          name: c.name,
          type: c.type,
        }));
        setCollectionTypes(mapped);
        // Set default collectionType if not editing
        if (!editId && mapped.length && !collectionType) setCollectionType(mapped[0].name);
      });
    // eslint-disable-next-line
  }, []);

  async function uploadImage(file: File, brand: string, collectionType: string): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("brand", brand);
    formData.append("collectionType", collectionType);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  }

  function handleEdit(product: Product) {
    setEditId(product._id);
    setName(product.name);
    setPrice(product.price.toString());
    setWeight(product.weight);
    setDiscount(product.discount ? product.discount.toString() : "");
    setCollectionType(product.collectionType);
    setBrand(product.brand);
    setStatus((product.status as "in_stock" | "out_of_stock") || "in_stock");
    setImage(product.image || "");
    setImageFile(null);
    setIngredientsInput(product.ingredients?.join(", ") || "");
    setShelfLife(product.shelfLife || "");
    setNutritionFacts({
      energy: product.nutritionFacts?.energy || "",
      fat: product.nutritionFacts?.fat || "",
      carbohydrates: product.nutritionFacts?.carbohydrates || "",
      protein: product.nutritionFacts?.protein || "",
    });
    setError("");
  }

  async function handleRemove(_id: string) {
    await fetch(`/api/admin/products/${_id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p._id !== _id));
    if (editId === _id) {
      resetForm();
    }
  }

  function resetForm() {
    setName("");
    setPrice("");
    setWeight("");
    setDiscount("");
    setCollectionType(collectionTypes[0]?.name || "");
    setBrand(brands[0]?.name || "");
    setStatus("in_stock");
    setImage("");
    setImageFile(null);
    setIngredients([]);
    setIngredientsInput("");
    setShelfLife("");
    setNutritionFacts({
      energy: "",
      fat: "",
      carbohydrates: "",
      protein: "",
    });
    setEditId(null);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price || !weight || !collectionType || !brand) {
      setError("Please fill all required fields.");
      return;
    }

    let imageUrl = image;
    if (imageFile) {
      const uploaded = await uploadImage(imageFile, brand, collectionType);
      if (!uploaded) {
        setError("Image upload failed.");
        return;
      }
      imageUrl = uploaded;
      setImage(imageUrl);
    }

    const link = `/${slugify(brand)}/${slugify(collectionType)}/${slugify(name)}`;
    const product: any = {
      name,
      price: Number(price),
      weight,
      discount: discount ? Number(discount) : undefined,
      collectionType,
      brand,
      status,
      image: imageUrl,
      ingredients: ingredientsInput.split(",").map(i => i.trim()).filter(Boolean),
      shelfLife,
      nutritionFacts: { ...nutritionFacts },
      link,
    };

    if (editId) {
      await fetch(`/api/admin/products/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      setProducts(products.map((p) => (p._id === editId ? { ...product, _id: editId } : p)));
    } else {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) {
        setError("Failed to save product");
        return;
      }
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
    }

    resetForm();
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <form className="flex flex-col gap-2 mb-6" onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" className="border p-2 rounded" />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (AMD)" type="number" className="border p-2 rounded" />
        <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="Weight (e.g. 100g)" className="border p-2 rounded" />
        <input value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Discounted Price (optional)" type="number" className="border p-2 rounded" />
        <select value={collectionType} onChange={e => setCollectionType(e.target.value)} className="border p-2 rounded">
          {collectionTypes.map(type => (
            <option key={type._id} value={type.name}>
              {type.name} {type.type === "dietary" ? "(Dietary)" : ""}
            </option>
          ))}
        </select>
        <select value={brand} onChange={e => setBrand(e.target.value)} className="border p-2 rounded">
          {brands.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value as "in_stock" | "out_of_stock")}
          className="border p-2 rounded"
        >
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">No Product</option>
        </select>
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
        <input
          value={ingredientsInput}
          onChange={e => setIngredientsInput(e.target.value)}
          placeholder="Ingredients (comma separated), sugars, salt"
          className="border p-2 rounded"
        />
        <input
          value={shelfLife}
          onChange={e => setShelfLife(e.target.value)}
          placeholder="Shelf Life / Expiry (e.g. 3 months, 2 days)"
          className="border p-2 rounded"
        />
        <div className="grid grid-cols-2 gap-2">
          <input name="energy" value={nutritionFacts.energy} onChange={e => setNutritionFacts({ ...nutritionFacts, energy: e.target.value })} placeholder="Energy (kcal)" className="border rounded px-2 py-1" />
          <input name="fat" value={nutritionFacts.fat} onChange={e => setNutritionFacts({ ...nutritionFacts, fat: e.target.value })} placeholder="Fat (g)" className="border rounded px-2 py-1" />
          <input name="carbohydrates" value={nutritionFacts.carbohydrates} onChange={e => setNutritionFacts({ ...nutritionFacts, carbohydrates: e.target.value })} placeholder="Carbohydrates (g)" className="border rounded px-2 py-1" />
          <input name="protein" value={nutritionFacts.protein} onChange={e => setNutritionFacts({ ...nutritionFacts, protein: e.target.value })} placeholder="Protein (g)" className="border rounded px-2 py-1" />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-2">
          <button type="submit" className="bg-chocolate text-white px-4 py-2 rounded">
            {editId ? "Save" : "Add"}
          </button>
          {editId && (
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <ul>
        {products.map((p) => (
          <li key={p._id} className="flex flex-col border-b py-2">
            <div className="flex items-center gap-2">
              {p.image && (
                <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />
              )}
              <span className="font-bold">{p.name}</span>
              <span>{p.weight}</span>
              <span>{p.price} AMD</span>
              <span>{p.collectionType}</span>
              <span>{p.brand}</span>
              <span>
                {p.status === "in_stock" ? (
                  <span className="text-green-600 font-semibold">In Stock</span>
                ) : (
                  <span className="text-red-600 font-semibold">No Product</span>
                )}
              </span>
              <button
                className="text-blue-600 underline text-xs mr-2"
                onClick={() => handleEdit(p)}
              >
                Edit
              </button>
              <button
                className="text-red-600 underline text-xs"
                onClick={() => handleRemove(p._id)}
              >
                Remove
              </button>
            </div>
            {p.ingredients && p.ingredients.length > 0 && (
              <div>
                <span className="font-semibold">Ingredients:</span> {p.ingredients.join(", ")}
              </div>
            )}
            {p.shelfLife && (
              <div>
                <span className="font-semibold">Shelf Life:</span> {p.shelfLife}
              </div>
            )}
            {p.nutritionFacts && (
              <div>
                <span className="font-semibold">Nutrition Facts:</span>
                <ul className="text-xs ml-2">
                  <li>Energy: {p.nutritionFacts.energy}</li>
                  <li>Fat: {p.nutritionFacts.fat}</li>
                  <li>Carbohydrates: {p.nutritionFacts.carbohydrates}</li>
                  <li>Protein: {p.nutritionFacts.protein}</li>
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}