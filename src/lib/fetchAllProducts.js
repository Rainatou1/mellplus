// Collect API pages before applying the catalogue's local filters and sorting.
export async function fetchAllProducts(filters = {}, options = {}) {
  const params = new URLSearchParams(filters)
  params.set('limit', '100')
  const products = []
  let totalPages = 1

  for (let page = 1; page <= totalPages; page++) {
    params.set('page', String(page))
    const response = await fetch(`/api/products?${params}`, options)
    if (!response.ok) throw new Error('Erreur lors du chargement des produits')
    const data = await response.json()
    products.push(...(data.products || []))
    totalPages = data.pagination.totalPages
  }

  return products
}
