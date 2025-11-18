'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronRight, Tag, Folder, FolderOpen } from 'lucide-react'
import {
  getMainCategories,
  getSubcategories,
  getSubSubcategories,
  getCategoryDisplayPath,
  validateCategoryPath
} from '@/lib/categoryHierarchy'

export default function HierarchicalCategorySelector({
  value = {},
  onChange,
  label = "Catégorie",
  required = false
}) {
  const [selectedMainCategory, setSelectedMainCategory] = useState(value.mainCategory || '')
  const [selectedSubcategory, setSelectedSubcategory] = useState(value.subcategory || '')
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState(value.subSubcategory || '')

  const [availableSubcategories, setAvailableSubcategories] = useState([])
  const [availableSubSubcategories, setAvailableSubSubcategories] = useState([])

  const [isMainCategoryOpen, setIsMainCategoryOpen] = useState(false)
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false)
  const [isSubSubcategoryOpen, setIsSubSubcategoryOpen] = useState(false)

  const mainCategories = getMainCategories()

  // Mise à jour des sous-catégories quand la catégorie principale change
  useEffect(() => {
    if (selectedMainCategory) {
      const subcategories = getSubcategories(selectedMainCategory)
      setAvailableSubcategories(subcategories)

      // Réinitialiser les sélections si elles ne sont plus valides
      if (selectedSubcategory && !subcategories.find(sub => sub.key === selectedSubcategory)) {
        setSelectedSubcategory('')
        setSelectedSubSubcategory('')
      }
    } else {
      setAvailableSubcategories([])
      setSelectedSubcategory('')
      setSelectedSubSubcategory('')
    }
  }, [selectedMainCategory, selectedSubcategory])

  // Mise à jour des sous-sous-catégories quand la sous-catégorie change
  useEffect(() => {
    if (selectedMainCategory && selectedSubcategory) {
      const subSubcategories = getSubSubcategories(selectedMainCategory, selectedSubcategory)
      setAvailableSubSubcategories(subSubcategories)

      // Réinitialiser la sélection si elle n'est plus valide
      if (selectedSubSubcategory && !subSubcategories.find(sub => sub.key === selectedSubSubcategory)) {
        setSelectedSubSubcategory('')
      }
    } else {
      setAvailableSubSubcategories([])
      setSelectedSubSubcategory('')
    }
  }, [selectedMainCategory, selectedSubcategory, selectedSubSubcategory])

  // Notification du parent quand la sélection change
  useEffect(() => {
    const categoryData = {
      mainCategory: selectedMainCategory,
      subcategory: selectedSubcategory,
      subSubcategory: selectedSubSubcategory,
      displayPath: getCategoryDisplayPath(selectedMainCategory, selectedSubcategory, selectedSubSubcategory)
    }

    if (onChange) {
      onChange(categoryData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMainCategory, selectedSubcategory, selectedSubSubcategory])

  const handleMainCategorySelect = (categoryKey) => {
    setSelectedMainCategory(categoryKey)
    setIsMainCategoryOpen(false)
    setIsSubcategoryOpen(false)
    setIsSubSubcategoryOpen(false)
  }

  const handleSubcategorySelect = (subcategoryKey) => {
    setSelectedSubcategory(subcategoryKey)
    setIsSubcategoryOpen(false)
    setIsSubSubcategoryOpen(false)
  }

  const handleSubSubcategorySelect = (subSubcategoryKey) => {
    setSelectedSubSubcategory(subSubcategoryKey)
    setIsSubSubcategoryOpen(false)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Affichage du chemin sélectionné */}
      {selectedMainCategory && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-sm text-blue-800">
            <Tag className="w-4 h-4" />
            <span className="font-medium">Sélection actuelle:</span>
          </div>
          <div className="mt-1 text-blue-900 font-medium">
            {getCategoryDisplayPath(selectedMainCategory, selectedSubcategory, selectedSubSubcategory)}
          </div>
        </div>
      )}

      {/* Sélection de la catégorie principale */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          1. Catégorie principale
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMainCategoryOpen(!isMainCategoryOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center space-x-2">
              <Folder className="w-5 h-5 text-blue-600" />
              <span className={selectedMainCategory ? 'text-gray-900' : 'text-gray-500'}>
                {selectedMainCategory
                  ? mainCategories.find(cat => cat.key === selectedMainCategory)?.name
                  : 'Sélectionnez une catégorie principale'
                }
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isMainCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMainCategoryOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {mainCategories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => handleMainCategorySelect(category.key)}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center space-x-2 ${
                    selectedMainCategory === category.key ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sélection de la sous-catégorie */}
      {availableSubcategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            2. Sous-catégorie
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-green-600" />
                <span className={selectedSubcategory ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedSubcategory
                    ? availableSubcategories.find(sub => sub.key === selectedSubcategory)?.name
                    : 'Sélectionnez une sous-catégorie'
                  }
                </span>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isSubcategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSubcategoryOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleSubcategorySelect('')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-500 italic"
                >
                  Aucune sous-catégorie
                </button>
                {availableSubcategories.map((subcategory) => (
                  <button
                    key={subcategory.key}
                    type="button"
                    onClick={() => handleSubcategorySelect(subcategory.key)}
                    className={`w-full px-4 py-3 text-left hover:bg-green-50 flex items-center space-x-2 ${
                      selectedSubcategory === subcategory.key ? 'bg-green-100 text-green-900' : 'text-gray-700'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>{subcategory.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sélection de la sous-sous-catégorie */}
      {availableSubSubcategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            3. Sous-sous-catégorie
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSubSubcategoryOpen(!isSubSubcategoryOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-purple-600" />
                <span className={selectedSubSubcategory ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedSubSubcategory
                    ? availableSubSubcategories.find(sub => sub.key === selectedSubSubcategory)?.name
                    : 'Sélectionnez une sous-sous-catégorie'
                  }
                </span>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isSubSubcategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSubSubcategoryOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleSubSubcategorySelect('')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-500 italic"
                >
                  Aucune sous-sous-catégorie
                </button>
                {availableSubSubcategories.map((subSubcategory) => (
                  <button
                    key={subSubcategory.key}
                    type="button"
                    onClick={() => handleSubSubcategorySelect(subSubcategory.key)}
                    className={`w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center space-x-2 ${
                      selectedSubSubcategory === subSubcategory.key ? 'bg-purple-100 text-purple-900' : 'text-gray-700'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>{subSubcategory.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p><strong>Instructions:</strong></p>
        <p>1. Sélectionnez d&apos;abord une catégorie principale</p>
        <p>2. Choisissez ensuite une sous-catégorie si applicable</p>
        <p>3. Affinez avec une sous-sous-catégorie si disponible</p>
      </div>
    </div>
  )
}