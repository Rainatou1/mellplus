// Load the complete inbox before applying its local search and category filters.
export async function fetchAllContacts(options = {}) {
  const contacts = []
  let totalPages = 1
  for (let page = 1; page <= totalPages; page++) {
    const response = await fetch(`/api/contact?page=${page}&limit=100`, {
      ...options, cache: 'no-store'
    })
    if (!response.ok) throw new Error('Erreur lors du chargement des messages')
    const data = await response.json()
    contacts.push(...data.contacts)
    totalPages = data.pagination.totalPages
  }
  return contacts
}
