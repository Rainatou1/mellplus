"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Récupérer les produits
  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Gérer le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Ajouter ou modifier un produit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/products/${editingId}` : "/api/products";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, price: parseFloat(formData.price) }),
    });

    setFormData({ name: "", description: "", price: "" });
    setEditingId(null);
    fetchProducts();
  };

  // Modifier un produit
  const handleEdit = (product) => {
    setFormData({ name: product.name, description: product.description, price: product.price });
    setEditingId(product.id);
  };

  // Supprimer un produit
  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Products</h1>

      {/* Formulaire ajout / modification */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Nom du produit"
          onChange={handleChange}
          className="border px-2 py-1 w-full rounded"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
          className="border px-2 py-1 w-full rounded"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          placeholder="Prix"
          onChange={handleChange}
          className="border px-2 py-1 w-full rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Modifier" : "Ajouter"}
        </button>
      </form>

      {/* Liste des produits */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nom</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Prix</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border px-2 py-1">{p.id}</td>
              <td className="border px-2 py-1">{p.name}</td>
              <td className="border px-2 py-1">{p.description}</td>
              <td className="border px-2 py-1">{p.price}</td>
              <td className="border px-2 py-1 space-x-2">
                <button onClick={() => handleEdit(p)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
