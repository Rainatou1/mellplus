import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { SourceTextModule, SyntheticModule } from 'node:vm'
import { createProductSearch } from '../src/lib/productSearch.js'

test('case, accents and decomposed Unicode match in every category', () => {
  const categories = ['ORDI_SERVEUR', 'RESEAUX_SECURITE', 'IMPRIMANTE_COPIEUR', 'ACCESSOIRES']
  for (const category of categories) {
    for (const query of ['caméra', 'Caméra', 'CAMÉRA', 'CAMERA', 'camera', 'CaMeRa']) {
      assert.ok(createProductSearch(query)({ name: 'Caméra', category }))
      assert.ok(createProductSearch(query)({ name: 'Came\u0301ra', category }))
    }
  }
})

test('multiple words, whitespace, null descriptions and literal symbols', () => {
  for (const query of ['câble HDMI', 'cable HDMI', 'câble hdmi', 'cable hdmi', 'CABLE HDMI', 'Cable Hdmi', '  cable   hdmi  ', 'hdmi cable']) {
    assert.ok(createProductSearch(query)({ name: 'Câble HDMI', description: null }))
  }
  assert.ok(createProductSearch('chargeur iphone')({ name: 'Chargeur pour iPhone' }))
  assert.ok(createProductSearch('reseau')({ name: 'Adaptateur', description: 'RÉSEAU' }))
  assert.ok(createProductSearch('camera')({ name: 'CAMERA' }))
  assert.ok(createProductSearch('')({ name: 'Produit', description: null }))
  assert.equal(createProductSearch('cable usb')({ name: 'Câble HDMI' }), false)
  assert.equal(createProductSearch('%')({ name: 'Câble HDMI' }), false)
})

test('API matches before pagination and preserves visibility, category and totals', async () => {
  const rows = Array.from({ length: 16 }, (_, i) => ({
    id: String(i), name: i < 12 ? 'Autre produit' : 'Câble HDMI', description: null,
    category: i === 14 ? 'RESEAUX_SECURITE' : 'ACCESSOIRES',
    publishedAt: i === 15 ? null : new Date(), createdAt: i
  }))
  const filter = where => rows.filter(row =>
    (!where.publishedAt || row.publishedAt !== null) &&
    (!where.category || row.category === where.category) &&
    (!where.id || where.id.in.includes(row.id)))
  const prisma = { product: {
    findMany: async ({ where, select, distinct, skip = 0, take }) => {
      let result = filter(where).sort((a, b) => b.createdAt - a.createdAt)
      if (distinct) result = result.filter((row, i, all) => all.findIndex(other => other.category === row.category) === i)
      result = result.slice(skip, take === undefined ? undefined : skip + take)
      return select ? result.map(row => Object.fromEntries(Object.keys(select).map(key => [key, row[key]]))) : result
    },
    count: async ({ where }) => filter(where).length
  } }
  const searchSource = await readFile(new URL('../src/lib/productSearch.js', import.meta.url), 'utf8')
  const routeSource = await readFile(new URL('../src/app/api/products/route.js', import.meta.url), 'utf8')
  const route = new SourceTextModule(routeSource)
  const dependencies = {
    'next/server': { NextResponse: { json: value => value } },
    '@/lib/prisma': { prisma },
    'next-auth': { getServerSession: async () => null },
    '@/app/api/auth/[...nextauth]/route': { authOptions: {} }
  }
  await route.link(specifier => {
    if (specifier === '@/lib/productSearch') return new SourceTextModule(searchSource)
    const exports = dependencies[specifier]
    return new SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value)
    })
  })
  await route.evaluate()
  const get = query => route.namespace.GET({ url: `http://localhost/api/products?${query}` })
  const first = await get('search=CABLE+HDMI&limit=1')
  assert.equal(first.pagination.total, 3)
  assert.equal(first.pagination.totalPages, 3)
  assert.deepEqual(first.products.map(row => row.id), ['14'])
  const second = await get('search=câble+hdmi&limit=1&page=2')
  assert.deepEqual(second.products.map(row => row.id), ['13'])
  const category = await get('search=cable+hdmi&category=ACCESSOIRES')
  assert.equal(category.pagination.total, 2)
  assert.deepEqual(category.categories, ['ACCESSOIRES'])
  assert.equal((await get('search=inexistant')).pagination.total, 0)
  assert.equal((await get('')).pagination.total, 15)
  rows.push({ ...rows[12], id: 'new', name: 'CÂBLE HDMI', createdAt: 20 })
  assert.equal((await get('search=cable+hdmi')).pagination.total, 4)
})
