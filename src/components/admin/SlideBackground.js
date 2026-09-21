'use client'

import { CUSTOM_GRADIENT, HEX_COLOR, gradientColors, TEXT_COLORS } from '@/lib/homeContent'

export default function SlideBackground({ value, onChange, textColor, onTextColorChange }) {
  const colors = gradientColors(value)
  const custom = CUSTOM_GRADIENT.test(value)
  const solid = HEX_COLOR.test(value)
  return <div className="space-y-3">
    <label className="block text-sm font-medium">Type de fond
      <select value={custom ? 'gradient' : solid ? 'solid' : 'preset'} onChange={event => onChange(event.target.value === 'solid' ? colors[0] : event.target.value === 'gradient' ? `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` : 'from-blue-600 to-blue-800')} className="block w-full border rounded-lg p-2 mt-1">
        <option value="preset">Palette prédéfinie</option><option value="gradient">Dégradé personnalisé</option><option value="solid">Couleur unie</option>
      </select>
    </label>
    {(custom || solid) && <div className="flex gap-4">
      {(solid ? [0] : [0, 1]).map(index => <label key={index} className="text-sm">{solid ? 'Fond' : index === 0 ? 'Couleur gauche' : 'Couleur droite'}
        <input type="color" value={colors[index]} onChange={event => { const next = [...colors]; next[index] = event.target.value; onChange(solid ? next[0] : `linear-gradient(90deg, ${next[0]}, ${next[1]})`) }} className="block w-20 h-10" />
      </label>)}
    </div>}
    <label className="block text-sm font-medium">Couleur du texte
      <select value={HEX_COLOR.test(textColor) ? 'custom' : textColor} onChange={event => onTextColorChange(event.target.value === 'custom' ? '#ffffff' : event.target.value)} className="block w-full border rounded-lg p-2 mt-1">
        {TEXT_COLORS.map(color => <option key={color} value={color}>{({ 'text-white': 'Blanc (historique)', 'text-black': 'Noir', 'text-gray-900': 'Gris très foncé', 'text-gray-800': 'Gris foncé' })[color]}</option>)}
        <option value="custom">Personnalisée</option>
      </select>
    </label>
    {HEX_COLOR.test(textColor) && <input aria-label="Couleur personnalisée du texte" type="color" value={textColor} onChange={event => onTextColorChange(event.target.value)} />}
  </div>
}
