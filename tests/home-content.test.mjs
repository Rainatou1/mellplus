import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm'
import { z } from 'zod'
import { slideSchema, slideUpdateSchema, safeImage } from '../src/lib/homeValidation.js'
import { slideStyle } from '../src/lib/homeContent.js'
import { loadHomeContent } from '../src/lib/loadHomeContent.js'
import { DEFAULT_SLIDES, DEFAULT_BLOCKS } from '../src/lib/homeDefaults.js'

const copy = value => JSON.parse(JSON.stringify(value))
const admin = { id: 'admin', role: 'ADMIN', active: true }
const example = { title: 'Test', image: '/images/logo.png', linkPrimary: '/contact', active: true, order: 0 }

// Exécute les vraies routes et la vraie autorisation, seule la base/session est simulée.
async function setup({ slides = [], blocks = [], user = admin, loggedIn = true } = {}) {
  let state = { slides: copy(slides), blocks: copy(blocks) }
  let sequence = 0
  const missing = () => { throw Object.assign(new Error('Missing'), { code: 'P2025' }) }
  // Promesses paresseuses comme Prisma, pour tester les transactions et leur rollback.
  const lazy = run => ({ then: (yes, no) => Promise.resolve().then(run).then(yes, no) })
  const prisma = {
    admin: { findUnique: async () => user },
    carousel: {
      findMany: async ({ where = {}, take, orderBy } = {}) => {
        let rows = state.slides.filter(row => where.active === undefined || row.active === where.active)
        if (orderBy) rows.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
        return copy(take ? rows.slice(0, take) : rows)
      },
      findUnique: async ({ where }) => copy(state.slides.find(row => row.id === where.id) || null),
      findFirst: async () => copy([...state.slides].sort((a, b) => b.order - a.order)[0] || null),
      count: async () => state.slides.length,
      create: ({ data }) => lazy(() => { const row = { id: `new-${++sequence}`, active: true, bgGradient: 'from-blue-600 to-blue-800', textColor: 'text-white', ...copy(data) }; state.slides.push(row); return copy(row) }),
      createMany: ({ data }) => lazy(() => { for (const row of data) state.slides.push({ id: `new-${++sequence}`, ...copy(row) }); return { count: data.length } }),
      update: ({ where, data }) => lazy(() => { const row = state.slides.find(row => row.id === where.id); if (!row) missing(); Object.assign(row, copy(data)); return copy(row) }),
      delete: ({ where }) => lazy(() => { const index = state.slides.findIndex(row => row.id === where.id); if (index < 0) missing(); return state.slides.splice(index, 1)[0] })
    },
    visualBlock: {
      findMany: async () => copy(state.blocks),
      upsert: ({ where, create, update }) => lazy(() => { let row = state.blocks.find(row => row.key === where.key); if (row) Object.assign(row, copy(update)); else { row = copy(create); state.blocks.push(row) } return copy(row) })
    },
    async $transaction(work) {
      const before = copy(state)
      try { return typeof work === 'function' ? await work(prisma) : await Promise.all(work) }
      catch (error) { state = before; throw error }
    }
  }
  const context = createContext({ URL, console, SyntaxError })
  const modules = new Map()
  const external = {
    'next/server': { NextResponse: { json: (body, options = {}) => ({ status: options.status || 200, body: copy(body) }) } },
    'next-auth': { getServerSession: async () => loggedIn ? { user: { id: 'admin', role: 'SUPER_ADMIN' } } : null },
    '@/app/api/auth/[...nextauth]/route': { authOptions: {} },
    '@/lib/prisma': { prisma }, zod: { z }
  }
  async function moduleFor(specifier, parent = resolve('index.js')) {
    if (external[specifier]) {
      const values = external[specifier]
      return new SyntheticModule(Object.keys(values), function () { for (const [key, value] of Object.entries(values)) this.setExport(key, value) }, { context })
    }
    let path = specifier.startsWith('@/') ? resolve('src', specifier.slice(2)) : resolve(dirname(parent), specifier)
    if (!path.endsWith('.js')) path += '.js'
    if (!modules.has(path)) {
      const source = await readFile(path, 'utf8')
      const module = new SourceTextModule(source, { context, identifier: path })
      modules.set(path, module)
      await module.link(child => moduleFor(child, path))
      await module.evaluate()
    }
    return modules.get(path)
  }
  return {
    prisma, state: () => copy(state),
    async call(path, method = 'GET', body, query = '', params = {}) {
      const module = await moduleFor(`@/app/api/${path}/route`)
      return module.namespace[method]({ url: `https://test.local/api/${path}${query}`, json: async () => body }, { params: Promise.resolve(params) })
    }
  }
}

test('public reads active slides in order without author metadata; admin reads inactive too', async () => {
  const env = await setup({ slides: [{ ...example, id: 'b', order: 2, createdBy: 'secret' }, { ...example, id: 'a', order: 0 }, { ...example, id: 'c', active: false }] })
  const result = await env.call('carousel')
  assert.deepEqual(result.body.slides.map(row => row.id), ['a', 'b'])
  assert.equal(result.body.slides[1].createdBy, undefined)
  assert.equal((await env.call('carousel', 'GET', null, '?admin=true')).body.slides.length, 3)
  assert.equal((await env.call('carousel/[id]', 'GET', null, '', { id: 'c' })).status, 404)
  assert.equal((await env.call('carousel/[id]', 'GET', null, '?admin=true', { id: 'c' })).status, 200)
  assert.equal((await env.call('carousel', 'GET', null, '?limit=-2')).status, 400)
})

test('create, edit, deactivate/reactivate and delete a slide through real routes', async () => {
  const env = await setup({ slides: [{ ...example, id: 'existing', order: 4 }] })
  const { order, ...data } = example
  const created = await env.call('carousel', 'POST', data)
  assert.equal(created.status, 201)
  assert.equal(created.body.slide.order, 5)
  const params = { id: created.body.slide.id }
  const updated = await env.call('carousel/[id]', 'PUT', { title: 'Modifié', bgGradient: 'linear-gradient(90deg, #123456, #abcdef)', active: false }, '', params)
  assert.equal(updated.status, 200)
  assert.equal(updated.body.slide.image, example.image)
  assert.equal((await env.call('carousel')).body.slides.length, 1)
  assert.equal((await env.call('carousel/[id]', 'PUT', { active: true }, '', params)).status, 200)
  assert.equal((await env.call('carousel')).body.slides.length, 2)
  assert.equal((await env.call('carousel/[id]', 'DELETE', null, '', params)).status, 200)
  assert.equal((await env.call('carousel/[id]', 'DELETE', null, '', params)).status, 404)
  assert.equal(env.state().slides[0].order, 4)
})

test('reordering is atomic and rejects duplicate or invalid positions', async () => {
  const env = await setup({ slides: [{ ...example, id: 'a' }, { ...example, id: 'b', order: 1 }] })
  assert.equal((await env.call('carousel/reorder', 'PUT', { slideOrders: [{ id: 'a', order: 1 }, { id: 'b', order: 0 }] })).status, 200)
  assert.deepEqual((await env.call('carousel')).body.slides.map(row => row.id), ['b', 'a'])
  const before = env.state()
  assert.equal((await env.call('carousel/reorder', 'PUT', { slideOrders: [{ id: 'a', order: 4 }, { id: 'missing', order: 5 }] })).status, 404)
  assert.deepEqual(env.state(), before)
  for (const rows of [[{ id: 'a', order: -1 }], [{ id: 'a', order: 1 }, { id: 'a', order: 2 }], [{ id: 'a', order: 1 }, { id: 'b', order: 1 }], []]) {
    assert.equal((await env.call('carousel/reorder', 'PUT', { slideOrders: rows })).status, 400)
  }
})

for (const [label, options] of [
  ['visitor', { loggedIn: false }], ['moderator', { user: { ...admin, role: 'MODERATOR' } }],
  ['support', { user: { ...admin, role: 'SUPPORT' } }], ['revoked admin', { user: { ...admin, active: false } }], ['deleted account', { user: null }]
]) test(`${label}: protected reads and every mutation denied despite stale JWT role`, async () => {
  const env = await setup(options)
  for (const [path, method, query] of [['carousel', 'POST'], ['carousel/[id]', 'PUT'], ['carousel/[id]', 'DELETE'], ['carousel/reorder', 'PUT'], ['carousel/import-defaults', 'POST'], ['visual-blocks/[key]', 'PUT'], ['carousel', 'GET', '?admin=true'], ['carousel/[id]', 'GET', '?admin=true'], ['visual-blocks', 'GET', '?admin=true']]) {
    assert.equal((await env.call(path, method, {}, query, { id: 'a', key: 'home.hero.left' })).status, 403, `${method} ${path}`)
  }
  assert.equal((await env.call('carousel')).status, 200)
  assert.deepEqual(env.state(), { slides: [], blocks: [] })
})

test('super admin can create content', async () => {
  const env = await setup({ user: { ...admin, role: 'SUPER_ADMIN' } })
  assert.equal((await env.call('carousel', 'POST', example)).status, 201)
})

test('side blocks use defaults, update independently, remove text/link and hide disabled content', async () => {
  const env = await setup()
  assert.deepEqual((await env.call('visual-blocks')).body.blocks, DEFAULT_BLOCKS)
  const { key, ...left } = DEFAULT_BLOCKS.left
  const changed = { ...left, title: '', subtitle: '', link: '', image: '/images/camera.png' }
  const result = await env.call('visual-blocks/[key]', 'PUT', changed, '', { key })
  assert.equal(result.status, 200)
  let blocks = (await env.call('visual-blocks')).body.blocks
  assert.equal(blocks.left.title, '')
  assert.equal(blocks.left.link, '')
  assert.deepEqual(blocks.right, DEFAULT_BLOCKS.right)
  await env.call('visual-blocks/[key]', 'PUT', { ...changed, active: false }, '', { key })
  blocks = (await env.call('visual-blocks')).body.blocks
  assert.equal(blocks.left, null)
  assert.equal((await env.call('visual-blocks', 'GET', null, '?admin=true')).body.blocks.left.active, false)
  assert.equal((await env.call('visual-blocks/[key]', 'PUT', changed, '', { key: 'unknown' })).status, 404)
})

test('safe default import is repeatable and never overwrites existing rows', async () => {
  const env = await setup()
  assert.equal((await env.call('carousel/import-defaults', 'POST')).body.imported, 8)
  assert.equal(env.state().blocks.length, 2)
  assert.equal((await env.call('carousel/import-defaults', 'POST')).body.imported, 0)
  assert.equal(env.state().slides.length, 8)
  const existing = await setup({ slides: [{ ...example, id: 'keep' }], blocks: [{ ...DEFAULT_BLOCKS.left, title: 'Conserver', active: false }] })
  assert.equal((await existing.call('carousel/import-defaults', 'POST')).body.imported, 0)
  assert.equal(existing.state().slides.length, 1)
  assert.equal(existing.state().blocks[0].title, 'Conserver')
  assert.equal(existing.state().blocks[0].active, false)
})

test('empty configuration and database failures preserve defaults; disabled rows never reappear', async () => {
  const env = await setup()
  assert.deepEqual(await loadHomeContent(env.prisma), { slides: DEFAULT_SLIDES, blocks: DEFAULT_BLOCKS })
  const disabled = await setup({ slides: [{ ...example, id: 'a', active: false }], blocks: [{ ...DEFAULT_BLOCKS.left, active: false }] })
  const content = await loadHomeContent(disabled.prisma)
  assert.deepEqual(content.slides, [])
  assert.equal(content.blocks.left, null)
  assert.deepEqual(content.blocks.right, DEFAULT_BLOCKS.right)
  const failing = { carousel: { findMany: async () => { throw new Error('offline') } }, visualBlock: env.prisma.visualBlock }
  assert.deepEqual((await loadHomeContent(failing)).slides, DEFAULT_SLIDES)
  const partial = { carousel: disabled.prisma.carousel, visualBlock: { findMany: async () => { throw new Error('missing table') } } }
  assert.deepEqual(await loadHomeContent(partial), { slides: [], blocks: DEFAULT_BLOCKS })
})

test('validates content, safe URLs, free colours, and legacy presets without accepting CSS injection', async () => {
  for (const slide of DEFAULT_SLIDES) { const { id, ...data } = slide; assert.ok(slideSchema.safeParse(data).success) }
  for (const linkPrimary of ['javascript:alert(1)', '//evil.test', '/\\evil.test', 'data:text/html,x']) assert.equal(slideSchema.safeParse({ ...example, linkPrimary }).success, false)
  assert.equal(safeImage('https://res.cloudinary.com/demo/image/upload/test.png'), true)
  assert.equal(safeImage('https://other.test/image.png'), false)
  assert.equal(safeImage('data:image/png;base64,abc'), false)
  assert.equal(slideUpdateSchema.safeParse({ title: '' }).success, false)
  assert.equal(slideUpdateSchema.safeParse({ active: 'false' }).success, false)
  assert.equal(slideUpdateSchema.safeParse({ createdBy: 'attacker' }).success, false)
  assert.deepEqual(slideStyle({ bgGradient: '#123456', textColor: '#abcdef' }), { background: '#123456', color: '#abcdef' })
  assert.deepEqual(slideStyle({ bgGradient: 'url(https://evil.test/x)' }), {})
  const env = await setup()
  assert.equal((await env.call('carousel', 'POST', { ...example, image: '' })).status, 400)
  assert.equal((await env.call('carousel', 'POST', { ...example, order: -1 })).status, 400)
})
