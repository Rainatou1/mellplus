import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { SourceTextModule, SyntheticModule } from 'node:vm'
import { z } from 'zod'
import * as search from '../src/lib/productSearch.js'

async function loadRoute(path, prisma, session = { user: { role: 'ADMIN' } }) {
  const route = new SourceTextModule(await readFile(new URL(`../src/app/api/products/${path}`, import.meta.url), 'utf8'))
  const dependencies = {
    'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } },
    '@/lib/prisma': { prisma },
    '@/lib/productSearch': search,
    'next-auth': { getServerSession: async () => session },
    '@/app/api/auth/[...nextauth]/route': { authOptions: {} },
    zod: { z }
  }
  await route.link(specifier => {
    const exports = dependencies[specifier]
    assert.ok(exports, `Unexpected dependency: ${specifier}`)
    return new SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value)
    })
  })
  await route.evaluate()
  return route.namespace
}

const request = body => ({ json: async () => body })
const params = { params: Promise.resolve({ id: 'product' }) }
const publishedAt = new Date('2026-09-01T12:00:00Z')

test('promotions select only checked, published products regardless of price or discount', async () => {
  const rows = []
  for (const published of [false, true]) {
    for (const isPromotion of [false, true]) {
      for (const price of [null, 10000]) {
        for (const discount of [null, 0, 20]) {
          rows.push({ id: String(rows.length), category: 'ACCESSOIRES', isPromotion, price, discount, publishedAt: published ? publishedAt : null })
        }
      }
    }
  }
  // A draft-only category must not leak through the category/statistics queries.
  rows.push({ id: 'draft', category: 'ORDI_SERVEUR', isPromotion: true, price: null, discount: 90, publishedAt: null })
  const queries = []
  const filter = where => {
    queries.push(where)
    return rows.filter(row => where.AND.every(clause => {
      if ('isPromotion' in clause) return row.isPromotion === clause.isPromotion
      if ('publishedAt' in clause) return row.publishedAt !== null
      if ('category' in clause) return row.category === clause.category
      if ('discount' in clause) {
        if ('not' in clause.discount) return row.discount !== null
        if ('gt' in clause.discount) return row.discount > clause.discount.gt
        return row.discount !== null && row.discount >= clause.discount.gte
      }
      throw new Error('Unexpected filter')
    }))
  }
  const prisma = { product: {
    findMany: async ({ where, select, skip = 0, take }) => {
      const found = filter(where)
      return select ? [...new Set(found.map(p => p.category))].map(category => ({ category })) : found.slice(skip, take ? skip + take : undefined)
    },
    count: async ({ where }) => filter(where).length,
    aggregate: async ({ where }) => {
      const discounts = filter(where).map(p => p.discount).filter(d => d !== null)
      return { _max: { discount: Math.max(...discounts) }, _avg: { discount: 0 }, _sum: { price: 0, quantity: 0 } }
    }
  } }
  const { GET } = await loadRoute('promotions/route.js', prisma, null)
  const result = await GET({ url: 'http://localhost/api/products/promotions?limit=100' })
  assert.equal(result.status, 200)
  assert.deepEqual(result.body.products, rows.filter(p => p.isPromotion && p.publishedAt))
  assert.equal(result.body.pagination.total, 6)
  assert.deepEqual(result.body.categories, ['ACCESSOIRES'])
  assert.equal(result.body.stats.maxDiscount, 20)
  for (const where of queries) {
    assert.ok(where.AND.some(clause => clause.isPromotion === true))
    assert.ok(where.AND.some(clause => clause.publishedAt?.not === null))
  }
  const filtered = await GET({ url: 'http://localhost/api/products/promotions?minDiscount=10' })
  assert.equal(filtered.body.pagination.total, 2)
  assert.ok(filtered.body.products.every(p => p.discount === 20))
})

test('creation accepts promotions without price/discount and never infers the flag from a reduction', async () => {
  const { POST } = await loadRoute('route.js', { product: {
    findMany: async () => [],
    create: async ({ data }) => data
  } })
  for (const published of [false, true]) {
    for (const isPromotion of [undefined, false, true]) {
      for (const discount of [null, 20]) {
        const result = await POST(request({ name: 'Produit', category: 'ACCESSOIRES', isPromotion, price: null, discount, publishedAt: published ? publishedAt.toISOString() : null }))
        assert.equal(result.status, 201)
        assert.equal(result.body.product.isPromotion, isPromotion ?? false)
        assert.equal(result.body.product.price, null)
        assert.equal(result.body.product.discount, discount)
        assert.deepEqual(result.body.product.publishedAt, published ? publishedAt : null)
      }
    }
  }
  assert.equal((await POST(request({ isPromotion: 'true' }))).status, 400)
})

test('list toggle changes only isPromotion, preserving publication and all product information', async () => {
  for (const date of [null, publishedAt]) {
    for (const enabled of [false, true]) {
      const original = { id: 'product', slug: 'product', publishedAt: date, price: null, discount: 20, quantity: 12, inStock: true, name: 'Produit', images: ['image.jpg'], specifications: { size: 'XL' }, isPromotion: !enabled }
      const { PUT } = await loadRoute('[id]/route.js', { product: {
        findFirst: async () => original,
        update: async ({ data }) => {
          assert.deepEqual(data, { isPromotion: enabled })
          return { ...original, ...data }
        }
      } })
      const result = await PUT(request({ isPromotion: enabled }), params)
      assert.equal(result.status, 200)
      assert.deepEqual(result.body.product, { ...original, isPromotion: enabled })
    }
  }
})

test('editing price/discount keeps promotion unchanged when omitted and accepts clearing both', async () => {
  const original = { id: 'product', publishedAt, price: 10000, discount: 20, isPromotion: true }
  const { PUT } = await loadRoute('[id]/route.js', { product: {
    findFirst: async () => original,
    update: async ({ data }) => ({ ...original, ...data })
  } })
  const result = await PUT(request({ price: null, discount: null }), params)
  assert.equal(result.status, 200)
  assert.deepEqual(result.body.product, { ...original, price: null, discount: null })
  const explicit = await PUT(request({ price: null, discount: null, isPromotion: false }), params)
  assert.equal(explicit.body.product.isPromotion, false)
  assert.deepEqual(explicit.body.product.publishedAt, publishedAt)
})

test('editing a product with specifications can save promotion without requiring price or discount', async () => {
  const original = { id: 'product', slug: 'product', publishedAt: null, price: null, discount: null, isPromotion: false, specifications: { RAM: '16 Go' } }
  const { PUT } = await loadRoute('[id]/route.js', { product: {
    findFirst: async () => original,
    findMany: async () => [],
    update: async ({ data }) => ({ ...original, ...data })
  } })
  const result = await PUT(request({ name: 'Produit', price: null, discount: null, specifications: original.specifications, isPromotion: true, publishedAt: null }), params)
  assert.equal(result.status, 200)
  assert.deepEqual(result.body.product.specifications, original.specifications)
  assert.equal(result.body.product.isPromotion, true)
  assert.equal(result.body.product.publishedAt, null)
})

test('promotion writes reject visitors and non-admin roles before database access', async () => {
  for (const session of [null, { user: { role: 'MODERATOR' } }, { user: { role: 'SUPPORT' } }]) {
    const { PUT } = await loadRoute('[id]/route.js', {}, session)
    assert.equal((await PUT(request({ isPromotion: true }), params)).status, 401)
    const { POST } = await loadRoute('route.js', {}, session)
    assert.equal((await POST(request({ isPromotion: true }), params)).status, 401)
  }
})

test('promotion updates validate boolean input', async t => {
  t.mock.method(console, 'error', () => {})
  const { PUT } = await loadRoute('[id]/route.js', {})
  for (const isPromotion of ['true', 'false', 1, null]) {
    assert.equal((await PUT(request({ isPromotion }), params)).status, 400)
  }
})
