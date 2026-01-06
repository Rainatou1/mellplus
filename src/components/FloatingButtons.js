"use client";
import React from 'react';
import Link from 'next/link';
import { MessageCircle, Star } from 'lucide-react';

const FloatingButtons = () => {
  return (
    <div className="fixed right-4 md:right-6 bottom-20 md:bottom-24 z-50 flex flex-col gap-3">
      {/* Bouton Contact */}
      <Link href="/contact">
        <button
          className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="Contactez-nous"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="hidden group-hover:inline-block text-sm font-medium whitespace-nowrap pr-2">
            Contact
          </span>
        </button>
      </Link>

      {/* Bouton Avis Clients */}
      <Link href="/avis">
        <button
          className="group flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="Donnez votre avis"
        >
          <Star className="w-6 h-6" />
          <span className="hidden group-hover:inline-block text-sm font-medium whitespace-nowrap pr-2">
            Avis
          </span>
        </button>
      </Link>
    </div>
  );
};

export default FloatingButtons;
