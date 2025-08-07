'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DropdownMenu({ label, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="px-4 py-2 hover:text-blue-600 font-semibold">{label}</button>
      {open && (
        <div className="absolute bg-white shadow-md rounded-md mt-2 z-10">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block px-4 py-2 hover:bg-gray-100 text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
