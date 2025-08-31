"use client";
import { useState } from "react";

export default function AdminCategories() {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(""); // Pour la hiérarchie
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parentId: parentId || null }),
    });

    if (res.ok) {
      setMessage("Catégorie ajoutée !");
      setName("");
      setParentId("");
    } else {
      setMessage("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Ajouter une catégorie</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="ID de la catégorie parente (facultatif)"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
