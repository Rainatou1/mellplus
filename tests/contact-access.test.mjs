import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm'
import test from 'node:test'
import { z } from 'zod'

const row = { id: 'fake-contact', name: 'Koubriya', email: 'visitor@example.test', message: 'Bonjour', read: false, starred: false, archived: false }
async function setup({ session = { user: { id: 'fake-admin', role: 'SUPER_ADMIN' } }, admin = { active: true, role: 'ADMIN' }, databaseFailure = false, missing = false } = {}) {
  const calls = { admin: [], reads: [], counts: [], updates: [], body: 0 }
  const context = createContext({ URL, SyntaxError, console: { error() {} } })
  const deps = {
    'next/server': { NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200, headers: options.headers || {} }) } },
    'next-auth': { getServerSession: async () => session },
    '@/app/api/auth/[...nextauth]/route': { authOptions: {} },
    zod: { z },
    '@/lib/prisma': { prisma: {
      admin: { findUnique: async args => { calls.admin.push(args); if (databaseFailure) throw Error('offline'); return admin } },
      contact: {
        findMany: async args => { calls.reads.push(args); return [row] },
        count: async args => { calls.counts.push(args); return 1 },
        update: async args => { calls.updates.push(args); if (missing) throw Object.assign(Error('missing'), { code: 'P2025' }); return { ...row, ...args.data } }
      }
    } },
    '@/lib/email': { sendContactNotification: async () => { throw Error('Unexpected SMTP') }, sendContactConfirmation: async () => { throw Error('Unexpected SMTP') }, isEmailConfigured: () => false },
    '@/lib/submissionSchemas': { contactSchema: z.object({}) },
    '@/lib/antispam': Object.fromEntries(['readSubmission', 'verifySubmission', 'storeSubmission', 'rejection', 'sourceIP', 'limitAttempts'].map(key => [key, () => { throw Error('Unexpected public submission path') }]))
  }
  const route = new SourceTextModule(await readFile(new URL('../src/app/api/contact/route.js', import.meta.url), 'utf8'), { context })
  await route.link(specifier => new SyntheticModule(Object.keys(deps[specifier]), function () {
    for (const [key, value] of Object.entries(deps[specifier])) this.setExport(key, value)
  }, { context }))
  await route.evaluate()
  const request = (body = { id: row.id, read: true }, query = '', contentType = 'application/json') => ({
    url: 'https://shop.example.test/api/contact' + query,
    headers: { get: key => key === 'content-type' ? contentType : null },
    json: async () => { calls.body++; if (body instanceof Error) throw body; return body }
  })
  return { route: route.namespace, calls, request }
}

for (const [label, options, status] of [
  ['anonymous', { session: null }, 401],
  ['session without identity', { session: { user: { role: 'ADMIN' } } }, 401],
  ['deleted account', { admin: null }, 403],
  ['disabled account', { admin: { active: false, role: 'ADMIN' } }, 403],
  ['revoked role despite admin JWT', { admin: { active: true, role: 'USER' } }, 403],
  ['unknown role', { admin: { active: true, role: 'UNKNOWN' } }, 403],
  ['authorization database unavailable', { databaseFailure: true }, 500]
]) {
  for (const method of ['GET', 'PATCH']) test(`${method}: ${label} cannot access contact data`, async () => {
    const { route, calls, request } = await setup(options)
    const response = await route[method](request())
    assert.equal(response.status, status)
    assert.equal(calls.reads.length + calls.counts.length + calls.updates.length, 0)
    assert.equal(calls.body, 0)
    assert.equal(response.body.contact, undefined)
    assert.equal(response.body.contacts, undefined)
  })
}
for (const role of ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']) {
  test(`${role}: current active role can read filtered paginated contacts`, async () => {
    const { route, calls, request } = await setup({ admin: { active: true, role }, session: { user: { id: 'fake-admin', role: 'STALE' } } })
    const response = await route.GET(request(undefined, '?page=2&limit=5&read=false&starred=true'))
    assert.equal(response.status, 200)
    assert.equal(response.body.contacts[0].id, row.id)
    assert.equal(response.body.pagination.total, 1)
    assert.equal(response.headers['Cache-Control'], 'private, no-store')
    assert.equal(calls.admin[0].where.id, 'fake-admin')
    assert.equal(calls.reads[0].skip, 5)
    assert.equal(calls.reads[0].take, 5)
    assert.equal(calls.reads[0].where.read, false)
    assert.equal(calls.reads[0].where.starred, true)
  })
  for (const field of ['read', 'starred', 'archived']) test(`${role}: can update ${field}`, async () => {
    const { route, calls, request } = await setup({ admin: { active: true, role } })
    const response = await route.PATCH(request({ id: row.id, [field]: true }))
    assert.equal(response.status, 200)
    assert.equal(response.body.contact[field], true)
    assert.deepEqual(Object.keys(calls.updates[0].data), [field])
  })
}
for (const body of [{ id: row.id }, { id: row.id, read: 'true' }, { id: row.id, message: 'overwritten', read: true }, { id: row.id, replied: true }, { read: true }, new SyntaxError('invalid JSON')]) {
  test('PATCH: malformed or unauthorized fields cannot reach Prisma', async () => {
    const { route, calls, request } = await setup()
    assert.equal((await route.PATCH(request(body))).status, 400)
    assert.equal(calls.updates.length, 0)
  })
}
test('PATCH rejects simple cross-origin content types before reading body', async () => {
  const { route, calls, request } = await setup()
  assert.equal((await route.PATCH(request(undefined, '', 'text/plain'))).status, 415)
  assert.equal(calls.body, 0)
})
test('PATCH preserves false values and missing-contact response', async () => {
  const { route, request } = await setup()
  assert.equal((await route.PATCH(request({ id: row.id, starred: false }))).body.contact.starred, false)
  const missing = await setup({ missing: true })
  assert.equal((await missing.route.PATCH(missing.request())).status, 404)
})
for (const query of ['?limit=101', '?limit=-1', '?page=0', '?page=1.5', '?page=invalid']) test('GET bounds pagination: ' + query, async () => {
  const { route, calls, request } = await setup()
  assert.equal((await route.GET(request(undefined, query))).status, 400)
  assert.equal(calls.reads.length, 0)
})
