import { z } from 'zod'
import { HEX_COLOR, CUSTOM_GRADIENT, LEGACY_GRADIENT, TEXT_COLORS } from './homeContent.js'

export function safeLink(value) {
  if (value === '') return true
  if (/[\s\\\u0000-\u001f\u007f]/.test(value)) return false
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password } catch { return false }
}
export function safeImage(value) {
  if (!value || !safeLink(value)) return false
  if (value.startsWith('/')) return true
  const url = new URL(value)
  return url.protocol === 'https:' && url.hostname === 'res.cloudinary.com'
}
const text = z.string().max(500)
const optionalText = text.nullable().optional()
const link = z.string().max(2048).refine(safeLink, 'Utilisez un chemin /page ou une URL HTTP(S)').nullable().optional()
export const slideSchema = z.object({
  title: text.trim().min(1), image: z.string().max(2048).refine(safeImage, 'Image locale ou Cloudinary requise'),
  subtitle: optionalText, description: z.string().max(10000).nullable().optional(),
  ctaPrimary: optionalText, ctaSecondary: optionalText, linkPrimary: link, linkSecondary: link,
  bgGradient: z.string().max(200).refine(value => HEX_COLOR.test(value) || CUSTOM_GRADIENT.test(value) || LEGACY_GRADIENT.test(value), 'Fond ou dégradé invalide').optional(),
  textColor: z.string().refine(value => HEX_COLOR.test(value) || TEXT_COLORS.includes(value), 'Couleur invalide').optional(),
  active: z.boolean().optional(), featured: z.boolean().optional(), order: z.number().int().min(0).max(2147483647).optional()
}).strict()
export const slideUpdateSchema = slideSchema.partial().refine(value => Object.keys(value).length > 0, 'Modification vide')
export const blockSchema = z.object({
  title: text, subtitle: optionalText, alt: optionalText,
  image: z.string().max(2048).refine(safeImage, 'Image locale ou Cloudinary requise'),
  link, active: z.boolean()
}).strict()
export const reorderSchema = z.object({
  slideOrders: z.array(z.object({ id: z.string().min(1), order: z.number().int().min(0).max(2147483647) }).strict()).min(1).max(1000)
}).strict().refine(({ slideOrders }) => new Set(slideOrders.map(row => row.id)).size === slideOrders.length && new Set(slideOrders.map(row => row.order)).size === slideOrders.length, 'Identifiants ou ordres dupliqués')
