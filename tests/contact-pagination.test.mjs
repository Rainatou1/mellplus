import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchAllContacts } from '../src/lib/fetchAllContacts.js'

test('inbox loads older messages across every API page without losing unread messages', async t => {
  const rows = Array.from({ length: 215 }, (_, id) => ({ id, read: id % 3 === 0 }))
  const requestedPages = []
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    const params = new URL(url, 'http://localhost').searchParams
    const page = Number(params.get('page'))
    assert.equal(params.get('limit'), '100')
    assert.equal(options.cache, 'no-store')
    requestedPages.push(page)
    return { ok: true, json: async () => ({
      contacts: rows.slice((page - 1) * 100, page * 100),
      pagination: { totalPages: 3 }
    }) }
  })
  const contacts = await fetchAllContacts()
  assert.deepEqual(requestedPages, [1, 2, 3])
  assert.deepEqual(contacts, rows)
  assert.equal(contacts.filter(contact => !contact.read).length, 143)
})

test('inbox handles an empty history', async t => {
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: true, json: async () => ({ contacts: [], pagination: { totalPages: 0 } })
  }))
  assert.deepEqual(await fetchAllContacts(), [])
})

test('inbox rejects incomplete history when a later page fails', async t => {
  t.mock.method(globalThis, 'fetch', async url => url.includes('page=1&') ? {
    ok: true, json: async () => ({ contacts: [{ id: 1 }], pagination: { totalPages: 2 } })
  } : { ok: false })
  await assert.rejects(fetchAllContacts(), /chargement des messages/)
})
