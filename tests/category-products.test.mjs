import assert from 'node:assert/strict'
import test from 'node:test'
import { CATEGORY_HIERARCHY } from '../src/lib/categoryHierarchy.js'
import { filterProductsByCategoryPath } from '../src/lib/categoryProducts.js'
import { fetchAllProducts } from '../src/lib/fetchAllProducts.js'
import { createProductSearch } from '../src/lib/productSearch.js'

for (const [category, definition] of Object.entries(CATEGORY_HIERARCHY)) {
  test(`${category}: parent includes every child, each child excludes its siblings`, () => {
    const children = Object.entries(definition.subcategories)
    const products = children.flatMap(([key, child]) => [
      { id: key, category, subcategory: key, name: 'Produit' },
      { id: `${key}-legacy`, category, subcategory: child.name, name: 'Produit' },
      { id: `${key}-descendant`, category, subcategory: key, subSubcategory: 'DETAIL', name: 'Produit' }
    ])
    const direct = { id: 'direct', category, subcategory: null, name: 'Produit' }
    const other = { id: 'other', category: 'OTHER', subcategory: children[0][0], name: 'Produit' }
    const all = [...products, direct, other]
    assert.deepEqual(filterProductsByCategoryPath(all, category), [...products, direct])
    for (const [key] of children) {
      assert.deepEqual(
        filterProductsByCategoryPath(all, category, key).map(product => product.id),
        [key, `${key}-legacy`, `${key}-descendant`]
      )
      assert.deepEqual(
        filterProductsByCategoryPath(all, category, key, 'DETAIL').map(product => product.id),
        [`${key}-descendant`]
      )
    }
  })
}

test('Connectique does not include another classification based on cable keywords', () => {
  const products = [
    { id: 'cable', category: 'ACCESSOIRES', subcategory: 'CONNECTIQUES', name: 'Câble HDMI' },
    { id: 'storage', category: 'ACCESSOIRES', subcategory: 'STOCKAGE', name: 'SSD avec câble HDMI' },
    { id: 'direct', category: 'ACCESSOIRES', subcategory: null, name: 'Câble HDMI' }
  ]
  const parent = filterProductsByCategoryPath(products, 'ACCESSOIRES')
  assert.equal(parent.filter(createProductSearch('CABLE hdmi')).length, 3)
  const child = filterProductsByCategoryPath(products, 'ACCESSOIRES', 'CONNECTIQUES')
  assert.deepEqual(child.filter(createProductSearch('cable hdmi')).map(product => product.id), ['cable'])
})

test('historical scanner labels still belong to Scanneur', () => {
  const products = ['SCANNEUR', 'Scanneur', 'Scanner', 'Scanners'].map(subcategory => ({
    category: 'IMPRIMANTE_COPIEUR', subcategory, name: 'Produit'
  }))
  assert.deepEqual(filterProductsByCategoryPath(products, 'IMPRIMANTE_COPIEUR', 'SCANNEUR'), products)
})

test('catalogue fetches every API page beyond 1000 products, retaining category and abort signal', async t => {
  const rows = Array.from({ length: 1005 }, (_, id) => ({ id, category: 'ACCESSOIRES' }))
  const controller = new AbortController()
  const pages = []
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    const params = new URL(url, 'http://localhost').searchParams
    assert.equal(params.get('category'), 'ACCESSOIRES')
    assert.equal(params.get('limit'), '100')
    assert.equal(options.signal, controller.signal)
    const page = Number(params.get('page'))
    pages.push(page)
    return { ok: true, json: async () => ({
      products: rows.slice((page - 1) * 100, page * 100),
      pagination: { totalPages: 11 }
    }) }
  })
  assert.deepEqual(await fetchAllProducts({ category: 'ACCESSOIRES' }, { signal: controller.signal }), rows)
  assert.deepEqual(pages, Array.from({ length: 11 }, (_, i) => i + 1))
})

test('catalogue rejects incomplete results when a later API page fails', async t => {
  let calls = 0
  t.mock.method(globalThis, 'fetch', async () => ++calls === 1
    ? { ok: true, json: async () => ({ products: [{ id: 'first' }], pagination: { totalPages: 2 } }) }
    : { ok: false })
  await assert.rejects(fetchAllProducts(), /Erreur lors du chargement/)
})
