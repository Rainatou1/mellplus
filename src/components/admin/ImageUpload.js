'use client'

import { useState, useRef } from 'react'
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Image",
  multiple = false,
  className = ""
}) {
  const [uploading, setUploading] = useState(false)
  const [urlMode, setUrlMode] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef(null)

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const uploadedImages = []

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Erreur lors de l\'upload')
        }

        const result = await response.json()
        uploadedImages.push(result.url)
      }

      if (multiple) {
        const currentImages = Array.isArray(value) ? value : []
        onChange([...currentImages, ...uploadedImages])
      } else {
        onChange(uploadedImages[0])
      }

      toast.success(`${uploadedImages.length} image(s) uploadée(s) avec succès`)

    } catch (error) {
      console.error('Erreur upload:', error)
      toast.error('Erreur lors de l\'upload: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return

    if (multiple) {
      const currentImages = Array.isArray(value) ? value : []
      if (!currentImages.includes(urlInput.trim())) {
        onChange([...currentImages, urlInput.trim()])
      }
    } else {
      onChange(urlInput.trim())
    }

    setUrlInput('')
    setUrlMode(false)
    toast.success('Image ajoutée depuis URL')
  }

  const handleRemoveImage = (imageToRemove) => {
    if (multiple) {
      const currentImages = Array.isArray(value) ? value : []
      onChange(currentImages.filter(img => img !== imageToRemove))
    } else {
      onChange('')
    }
    if (onRemove) onRemove(imageToRemove)
  }

  // Pour le mode simple (une seule image)
  if (!multiple) {
    return (
      <div className={`space-y-3 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>

        {/* Image actuelle */}
        {value && (
          <div className="relative inline-block">
            <Image
              src={value}
              alt="Image actuelle"
              width={200}
              height={200}
              className="object-cover rounded-lg border"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(value)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Mode URL */}
        {urlMode && (
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => {
                setUrlMode(false)
                setUrlInput('')
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        )}

        {/* Boutons d'action */}
        {!urlMode && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              ) : (
                <Upload size={16} />
              )}
              {uploading ? 'Upload...' : 'Upload depuis PC'}
            </button>

            <button
              type="button"
              onClick={() => setUrlMode(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Link size={16} />
              URL en ligne
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(Array.from(e.target.files))}
          className="hidden"
        />
      </div>
    )
  }

  // Pour le mode multiple (galerie d'images)
  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Images actuelles */}
      {Array.isArray(value) && value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {value.map((image, index) => (
            <div key={index} className="relative group">
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                width={120}
                height={120}
                className="object-cover rounded-lg border w-full h-24"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(image)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mode URL */}
      {urlMode && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ajouter
          </button>
          <button
            type="button"
            onClick={() => {
              setUrlMode(false)
              setUrlInput('')
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Boutons d'action */}
      {!urlMode && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            ) : (
              <Upload size={16} />
            )}
            {uploading ? 'Upload...' : 'Upload depuis PC'}
          </button>

          <button
            type="button"
            onClick={() => setUrlMode(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Link size={16} />
            URL en ligne
          </button>
        </div>
      )}

      {/* Zone de drag & drop */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
        onDrop={(e) => {
          e.preventDefault()
          const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
          )
          if (files.length > 0) {
            handleFileUpload(files)
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
      >
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          Glissez-déposez vos images ici ou cliquez sur &quot;Upload depuis PC&quot;
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Formats acceptés: JPEG, PNG, WebP, GIF (max 5MB)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileUpload(Array.from(e.target.files))}
        className="hidden"
      />
    </div>
  )
}