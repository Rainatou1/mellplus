import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchAllQuotes } from '../src/lib/fetchAllQuotes.js'

test('quotes include older requests beyond the first hundred and preserve statuses', async t => {
  const rows = Array.from({ length: 215 }, (_, id) => ({ id, status: id % 2 ? 'PENDING' : 'REVIEWING' }))
  const pages = []
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    const params = new URL(url, 'http://localhost').searchParams
    const page = Number(params.get('page'))
    pages.push(page)
    assert.equal(params.get('limit'), '100')
    assert.equal(options.cache, 'no-store')
    return { ok: true, json: async () => ({
      quotes: rows.slice((page - 1) * 100, page * 100), pagination: { totalPages: 3 }
    }) }
  })
  assert.deepEqual(await fetchAllQuotes(), rows)
  assert.deepEqual(pages, [1, 2, 3])
})

test('quotes handle empty history', async t => {
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: true, json: async () => ({ quotes: [], pagination: { totalPages: 0 } })
  }))
  assert.deepEqual(await fetchAllQuotes(), [])
})

test('quotes reject incomplete history when an older page fails', async t => {
  t.mock.method(globalThis, 'fetch', async url => url.includes('page=1&') ? {
    ok: true, json: async () => ({ quotes: [{ id: 1 }], pagination: { totalPages: 2 } })
  } : { ok: false })
  await assert.rejects(fetchAllQuotes(), /chargement des devis/)
})
