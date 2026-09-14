// Shared by the API and the catalogue: keep stored/displayed text intact.
export function normalizeSearchText(value) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function createProductSearch(search) {
  const words = normalizeSearchText(search).split(' ').filter(Boolean)

  return (product) => {
    const fields = [product.name, product.description].map(normalizeSearchText)
    return words.every(word => fields.some(field => field.includes(word)))
  }
}
