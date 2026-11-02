import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm'
import { z } from 'zod'
import { isSpamSubmission } from '../src/lib/antiSpam.js'

test('honeypot and minimum delay boundaries', () => {
  const now = 10000
  for (const formStartedAt of [undefined, null, '', 'invalid', 0, 10001, 7001]) {
    assert.equal(isSpamSubmission({ website: '', formStartedAt }, now), true)
  }
  assert.equal(isSpamSubmission({ website: '', formStartedAt: '7000' }, now), false)
  assert.equal(isSpamSubmission({ website: '', formStartedAt: 6000 }, now), false)
  assert.equal(isSpamSubmission({ website: 'https://spam.test', formStartedAt: 6000 }, now), true)
})

for (const route of ['contact', 'quotes']) {
  test(`${route}: spam returns 200 without database or email calls; valid requests retain validation`, async () => {
    const context = createContext({ console })
    let writes = 0
    let emails = 0
    const create = async ({ data }) => { writes++; return { ...data, id: 'test', createdAt: new Date() } }
    const send = async () => { emails++; return { success: true } }
    const deps = {
      'next/server': { NextResponse: { json: (body, options) => ({ body, ...options }) } },
      '@/lib/prisma': { prisma: { contact: { create }, quoteRequest: { create } } },
      '@/lib/antiSpam': { isSpamSubmission },
      zod: { z },
      'next-auth': { getServerSession: async () => null },
      '@/app/api/auth/[...nextauth]/route': { authOptions: {} },
      '@/lib/email': { isEmailConfigured: () => true, sendContactNotification: send, sendContactConfirmation: send, sendQuoteNotification: send, sendQuoteConfirmation: send }
    }
    const module = new SourceTextModule(await readFile(new URL(`../src/app/api/${route}/route.js`, import.meta.url), 'utf8'), { context })
    await module.link(specifier => new SyntheticModule(Object.keys(deps[specifier]), function () {
      for (const [key, value] of Object.entries(deps[specifier])) this.setExport(key, value)
    }, { context }))
    await module.evaluate()
    const post = body => module.namespace.POST({ json: async () => body, headers: { get: () => null } })
    for (const body of [
      { website: 'spam', formStartedAt: Date.now() - 5000 },
      { website: '', formStartedAt: Date.now() },
      {}, { website: '', formStartedAt: 'invalid' }
    ]) {
      const response = await post(body)
      assert.equal(response.status, 200)
      assert.equal(response.body.success, true)
    }
    assert.equal(writes, 0)
    assert.equal(emails, 0)
    const fields = { website: '', formStartedAt: Date.now() - 5000 }
    assert.equal((await post(fields)).status, 400)
    assert.equal(writes, 0)
    const valid = { ...fields, name: 'Visiteur test', email: 'test@example.com', phone: '12345678', subject: 'Test', message: 'Un message de test valide', type: 'mixed', items: [{ type: 'custom', name: 'Test', quantity: 1, unitPrice: 1, totalPrice: 1 }] }
    assert.equal((await post(valid)).status, 201)
    assert.equal(writes, 1)
    assert.equal(emails, 2)
  })
}
