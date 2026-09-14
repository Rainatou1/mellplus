import { CATEGORY_HIERARCHY } from './categoryHierarchy.js'

// Historical labels used in the header, alongside the hierarchy's keys/names.
const subcategoryAliases = {
  SCANNEUR: ['Scanner', 'Scanners']
}

const normalizeValue = (value) => {
  if (value === null || value === undefined) return ''
  return value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

const categoryMatches = (productCategory, categoryKey) => {
  if (!productCategory || !categoryKey) return false
  const normalizedProduct = normalizeValue(productCategory)
  const normalizedKey = normalizeValue(categoryKey)
  if (normalizedProduct === normalizedKey) return true

  const displayName = CATEGORY_HIERARCHY[categoryKey]?.name
  if (displayName && normalizeValue(displayName) === normalizedProduct) return true

  return false
}

const subcategoryMatches = (product, categoryKey, subcategoryKeyOrName) => {
  if (!subcategoryKeyOrName) return true
  const normalizedProduct = normalizeValue(product.subcategory)
  if (!normalizedProduct) return false

  const candidates = new Set()
  candidates.add(normalizeValue(subcategoryKeyOrName))

  const displayName = CATEGORY_HIERARCHY[categoryKey]?.subcategories?.[subcategoryKeyOrName]?.name
  if (displayName) candidates.add(normalizeValue(displayName))
  for (const alias of subcategoryAliases[subcategoryKeyOrName] || []) {
    candidates.add(normalizeValue(alias))
  }

  // An explicit classification takes precedence over words in the product name.
  return candidates.has(normalizedProduct)
}

const subSubcategoryMatches = (product, categoryKey, subcategoryKeyOrName, subSubcategoryKeyOrName) => {
  if (!subSubcategoryKeyOrName) return true
  const normalizedProduct = normalizeValue(product.subSubcategory)
  if (!normalizedProduct) return false

  const candidates = new Set()
  candidates.add(normalizeValue(subSubcategoryKeyOrName))

  const displayName = CATEGORY_HIERARCHY[categoryKey]?.subcategories?.[subcategoryKeyOrName]?.subSubcategories?.[subSubcategoryKeyOrName]?.name
  if (displayName) candidates.add(normalizeValue(displayName))

  return candidates.has(normalizedProduct)
}

// Without a child filter, include every descendant and directly assigned product.
export function filterProductsByCategoryPath(products, category, subcategory, subSubcategory) {
  return products.filter(product =>
    categoryMatches(product.category, category) &&
    subcategoryMatches(product, category, subcategory) &&
    subSubcategoryMatches(product, category, subcategory, subSubcategory)
  )
}
