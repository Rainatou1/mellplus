// Collect all requests so local filters and statistics include older quotes.
export async function fetchAllQuotes(options = {}) {
  const quotes = []
  let totalPages = 1
  for (let page = 1; page <= totalPages; page++) {
    const response = await fetch(`/api/quotes?page=${page}&limit=100`, {
      ...options, cache: 'no-store'
    })
    if (!response.ok) throw new Error('Erreur lors du chargement des devis')
    const data = await response.json()
    quotes.push(...data.quotes)
    totalPages = data.pagination.totalPages
  }
  return quotes
}
