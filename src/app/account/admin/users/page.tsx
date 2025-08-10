"use client";
import { useState, useEffect } from "react";

type Account = {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
};

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/accounts")
      .then(res => res.json())
      .then(data => setAccounts(data));
  }, []);

  function startEdit(account: Account) {
    setEditId(account._id);
    setName(account.name);
    setEmail(account.email);
    setProfileImage(account.profileImage || "");
  }

  function cancelEdit() {
    setEditId(null);
    setName("");
    setEmail("");
    setProfileImage("");
    setError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) {
      setError("Name and email required");
      return;
    }
    setError(null);
    const method = editId ? "PUT" : "POST";
    const body = JSON.stringify({ id: editId, name, email, profileImage });
    const res = await fetch("/api/admin/accounts", {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (res.ok) {
      const updated = await res.json();
      if (editId) {
        setAccounts(accounts.map(a => a._id === editId ? updated : a));
      } else {
        setAccounts([...accounts, updated]);
      }
      cancelEdit();
    } else {
      setError("Failed to save");
    }
  }

  async function handleDelete(_id: string) {
    await fetch(`/api/admin/accounts?id=${_id}`, { method: "DELETE" });
    setAccounts(accounts.filter(a => a._id !== _id));
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>
      <form onSubmit={handleSave} className="flex flex-col gap-2 mb-6">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border p-2 rounded" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded" />
        <input value={profileImage} onChange={e => setProfileImage(e.target.value)} placeholder="Profile Image URL" className="border p-2 rounded" />
        <div className="flex gap-2">
          <button type="submit" className="bg-chocolate text-white px-4 py-2 rounded">{editId ? "Save" : "Add"}</button>
          {editId && <button type="button" onClick={cancelEdit} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>}
        </div>
        {error && <div className="text-red-500">{error}</div>}
      </form>
      <ul>
        {accounts.map(a => (
          <li key={a._id} className="flex justify-between items-center border-b py-2">
            <div className="flex items-center gap-3">
              {a.profileImage && <img src={a.profileImage} alt={a.name} className="w-10 h-10 object-contain rounded" />}
              <div>
                <div className="font-bold">{a.name}</div>
                <div className="text-xs text-gray-500">{a.email}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(a)} className="text-blue-500">Edit</button>
              <button onClick={() => handleDelete(a._id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}