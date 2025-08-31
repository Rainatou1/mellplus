"use client";
import { useState, useEffect } from "react";

export default function AdminProduits() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // récupérer toutes les catégories pour le select
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/produits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, price: parseFloat(price), categoryId }),
    });

    if (res.ok) {
      setMessage("Produit ajouté !");
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
    } else {
      setMessage("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Ajouter un produit</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Nom du produit"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          required
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          required
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
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
