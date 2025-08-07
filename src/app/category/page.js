"use client"; // uniquement si tu as besoin d'interactivité (useState, useEffect, etc.)

import React from 'react';

// Simuler une base de données statique
const allProducts = [
  { id: 1, name: "Ordinateur Portable", price: "500 000 FCFA" },
  { id: 2, name: "Clavier Gamer", price: "50 000 FCFA" },
  { id: 3, name: "Casque Bluetooth", price: "35 000 FCFA" },
  { id: 4, name: "Switch 24 ports", price: "120 000 FCFA" },
];

export default function CategoryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold capitalize mb-6">
        Produits
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
