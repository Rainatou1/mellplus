// CSS explicite pour les couleurs libres, sans classes Tailwind générées à la volée.
export const HEX_COLOR = /^#[0-9a-f]{6}$/i
export const CUSTOM_GRADIENT = /^linear-gradient\(90deg, (#[0-9a-f]{6}), (#[0-9a-f]{6})\)$/i
export const LEGACY_GRADIENT = /^from-(?:blue|purple|pink|green|teal|red|gray|indigo|orange|yellow|black)-(?:[1-9]00|50) to-(?:blue|purple|pink|green|teal|red|gray|indigo|orange|yellow|black)-(?:[1-9]00|50)$/
export const TEXT_COLORS = ['text-white', 'text-black', 'text-gray-900', 'text-gray-800']
export function slideStyle(slide) {
  const background = slide.bgGradient || ''
  return {
    ...(HEX_COLOR.test(background) || CUSTOM_GRADIENT.test(background) ? { background } : {}),
    ...(HEX_COLOR.test(slide.textColor || '') ? { color: slide.textColor } : {})
  }
}
export function gradientColors(background) {
  const match = CUSTOM_GRADIENT.exec(background || '')
  if (match) return [match[1], match[2]]
  if (HEX_COLOR.test(background || '')) return [background, background]
  return ['#2563eb', '#1e40af']
}
export function publicSlide(slide) {
  const { createdBy, createdAt, updatedAt, ...content } = slide
  return content
}
export function publicBlock(block) {
  if (!block?.active) return null
  const { key, title, subtitle, image, alt, link, active } = block
  return { key, title, subtitle, image, alt, link, active }
}
