'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ImageUpload from './ImageUpload'
import HeroSideBlock from '@/components/HeroSideBlock'
import { safeImage } from '@/lib/homeValidation'

function BlockEditor({ initial, side }) {
  const [block, setBlock] = useState(initial)
  const [saving, setSaving] = useState(false)
  async function save(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const { image, title, subtitle, alt, link, active } = block
      const response = await fetch(`/api/visual-blocks/${block.key}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, title, subtitle, alt, link, active })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setBlock(data.block)
      toast.success('Bloc enregistré')
    } catch (error) { toast.error(error.message || 'Enregistrement impossible') }
    finally { setSaving(false) }
  }
  return <form onSubmit={save} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
    <h3 className="font-semibold text-lg">Bloc {side === 'left' ? 'gauche' : 'droit'}</h3>
    <ImageUpload label="Image" validateUrl={safeImage} value={block.image} onChange={image => setBlock({ ...block, image })} onRemove={() => setBlock({ ...block, image: '' })} />
    <p className="text-xs text-gray-500">Importez une image ou utilisez une URL Cloudinary / un chemin local.</p>
    {[['title', 'Titre'], ['subtitle', 'Sous-texte'], ['alt', 'Texte alternatif de l’image'], ['link', 'Lien (facultatif, ex. /products)']].map(([field, label]) => <label key={field} className="block text-sm font-medium text-gray-700">
      {label}
      <input value={block[field] || ''} maxLength={field === 'link' ? 2048 : 500} onChange={event => setBlock({ ...block, [field]: event.target.value })} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
    </label>)}
    <label className="flex items-center gap-2"><input type="checkbox" checked={block.active} onChange={event => setBlock({ ...block, active: event.target.checked })} />Bloc actif</label>
    <p className="text-xs text-gray-500">Désactivez le bloc pour retirer son contenu public tout en conservant son emplacement. Videz les textes ou le lien pour les supprimer.</p>
    {block.image && <div className="pointer-events-none" inert=""><HeroSideBlock block={block} side={side} preview /></div>}
    <button disabled={saving || !block.image} className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50">{saving ? 'Enregistrement…' : 'Enregistrer ce bloc'}</button>
  </form>
}

export default function HomeVisualBlocks() {
  const [blocks, setBlocks] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/visual-blocks?admin=true', { signal: controller.signal, cache: 'no-store' })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); return data })
      .then(data => setBlocks(data.blocks))
      .catch(error => { if (error.name !== 'AbortError') setError(error.message) })
    return () => controller.abort()
  }, [])
  return <section className="space-y-4">
    <h2 className="text-xl font-bold text-gray-900">Images latérales de l’accueil</h2>
    {error ? <p role="alert" className="text-red-600">{error}</p> : !blocks ? <p>Chargement des blocs…</p> : <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {Object.entries(blocks).map(([side, block]) => <BlockEditor key={side} initial={block} side={side} />)}
    </div>}
  </section>
}
