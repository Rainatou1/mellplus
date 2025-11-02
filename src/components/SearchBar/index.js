"use client";
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getCategoryDisplayName } from '@/lib/categoryMapping';

export default function SearchBar({ isMobile = false, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      setSearchResults(data.products || []);
      setShowResults(true);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setSearchQuery('');
      if (onClose && isMobile) {
        onClose();
      }
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery('');
    if (onClose && isMobile) {
      onClose();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <div ref={searchRef} className={`relative w-full ${isMobile ? 'pb-3' : ''}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un produit..."
          className={`w-full px-4 ${isMobile ? 'py-3 pr-16' : 'py-2 lg:py-3 pr-14 lg:pr-16'} border border-gray-300 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          style={{ backgroundColor: '#dae3ff' }}
        />
        <button
          type="submit"
          className={`absolute inset-y-0 right-0 ${isMobile ? 'px-8' : 'px-6 lg:px-8'} hover:opacity-80 text-white rounded-r-full flex items-center justify-center`}
          style={{ backgroundColor: '#016bb6' }}
        >
          <Search className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5 lg:w-6 lg:h-6'}`} />
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (searchResults.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Recherche en cours...
            </div>
          ) : (
            <>
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug || product.id}`}
                  onClick={handleResultClick}
                  className="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="w-12 h-12 flex-shrink-0 mr-3">
                    <Image
                      src={product.image || '/images/ordi.jpg'}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {product.brand} {product.category && `• ${getCategoryDisplayName(product.category)}`}
                    </p>
                    {product.price && (
                      <p className="text-sm font-semibold text-blue-600">
                        {formatPrice(product.price)} FCFA
                      </p>
                    )}
                  </div>
                </Link>
              ))}

              {searchQuery && (
                <Link
                  href={`/products?search=${encodeURIComponent(searchQuery)}`}
                  onClick={handleResultClick}
                  className="block p-3 text-center text-blue-600 hover:bg-blue-50 border-t font-medium"
                >
                  Voir tous les résultats pour &quot;{searchQuery}&quot;
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}