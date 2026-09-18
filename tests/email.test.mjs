import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm'
import { z } from 'zod'

const source = await readFile(new URL('../src/lib/email.js', import.meta.url), 'utf8')
const credentials = {
  EMAIL_USER: 'gmail@example.test', EMAIL_PASSWORD: 'fake-google-password',
  OVH_USER: 'official@example.test', OVH_PASSWORD: 'fake-ovh-password'
}
const data = {
  name: 'Test Mellplus', email: 'visitor@example.test', phone: '12345678',
  subject: 'Test', message: 'Message de test', createdAt: new Date().toISOString(),
  adminEmail: 'admin@example.test', success: true, timestamp: new Date().toISOString(),
  type: 'product', items: [{ type: 'custom', name: 'Article', quantity: 1, unitPrice: 10, totalPrice: 10 }]
}
async function setup(env, fail = false) {
  const calls = []
  const context = createContext({ process: { env }, console: { log() {}, error() {} } })
  const module = new SourceTextModule(source, { context })
  await module.link(() => new SyntheticModule(['default'], function () {
    this.setExport('default', { createTransport(config) {
      const call = { config }
      calls.push(call)
      return { async sendMail(mail) {
        call.mail = mail
        if (fail) throw new Error('SMTP unavailable')
        return { messageId: 'mock-id' }
      } }
    } })
  }, { context }))
  await module.evaluate()
  return { module, calls, context }
}
for (const provider of ['gmail', 'ovh', undefined]) {
  test(`all five senders use only ${provider ?? 'default gmail'}`, async () => {
    const { module, calls } = await setup({ ...credentials, ...(provider ? { EMAIL_PROVIDER: provider } : {}) })
    assert.equal(module.namespace.isEmailConfigured(), true)
    for (const name of ['sendContactNotification', 'sendContactConfirmation', 'sendQuoteNotification', 'sendQuoteConfirmation', 'sendLoginAlert']) {
      assert.equal((await module.namespace[name](data)).success, true)
    }
    assert.equal(calls.length, 5)
    for (const { config, mail } of calls) {
      const ovh = provider === 'ovh'
      assert.equal(config.host, ovh ? 'smtp.mail.ovh.net' : 'smtp.gmail.com')
      assert.equal(config.port, ovh ? 465 : 587)
      assert.equal(config.secure, ovh)
      assert.equal(config.auth.user, ovh ? credentials.OVH_USER : credentials.EMAIL_USER)
      assert.equal(config.auth.pass, ovh ? credentials.OVH_PASSWORD : credentials.EMAIL_PASSWORD)
      assert.equal(mail.from, config.auth.user)
      assert.equal(mail.replyTo, undefined)
      if (ovh) assert.equal(config.tls, undefined)
    }
    assert.deepEqual(calls.map(c => c.mail.to), ['binome296@gmail.com', data.email, 'binome296@gmail.com', data.email, data.adminEmail])
  })
}
test('invalid provider is rejected before creating a transport', async () => {
  for (const provider of ['unknown', '']) {
    const { module, calls } = await setup({ ...credentials, EMAIL_PROVIDER: provider })
    assert.throws(() => module.namespace.isEmailConfigured(), /EMAIL_PROVIDER/)
    assert.equal((await module.namespace.sendContactNotification(data)).success, false)
    assert.equal(calls.length, 0)
  }
})
for (const provider of ['gmail', 'ovh']) {
  test(`${provider}: missing credentials never use the other provider`, async () => {
    for (const key of provider === 'ovh' ? ['OVH_USER', 'OVH_PASSWORD'] : ['EMAIL_USER', 'EMAIL_PASSWORD']) {
      const { module, calls } = await setup({ ...credentials, EMAIL_PROVIDER: provider, [key]: '' })
      assert.equal(module.namespace.isEmailConfigured(), false)
      assert.equal((await module.namespace.sendLoginAlert(data)).success, false)
      assert.equal(calls.length, 0)
    }
  })
  test(`${provider}: SMTP failure never falls back`, async () => {
    const { module, calls } = await setup({ ...credentials, EMAIL_PROVIDER: provider }, true)
    assert.equal((await module.namespace.sendQuoteNotification(data)).success, false)
    assert.equal(calls.length, 1)
  })
  for (const route of ['contact', 'quotes']) {
    test(`${route} route sends with only ${provider} credentials`, async () => {
      const env = provider === 'ovh'
        ? { EMAIL_PROVIDER: provider, OVH_USER: credentials.OVH_USER, OVH_PASSWORD: credentials.OVH_PASSWORD }
        : { EMAIL_PROVIDER: provider, EMAIL_USER: credentials.EMAIL_USER, EMAIL_PASSWORD: credentials.EMAIL_PASSWORD }
      const { module, calls, context } = await setup(env)
      const routeModule = new SourceTextModule(await readFile(new URL(`../src/app/api/${route}/route.js`, import.meta.url), 'utf8'), { context })
      const deps = {
        'next/server': { NextResponse: { json: (body, options) => ({ body, ...options }) } },
        '@/lib/prisma': { prisma: { contact: { create: async () => ({ ...data, id: 'test' }) }, quoteRequest: { create: async () => ({ ...data, id: 'test' }) } } },
        zod: { z }, 'next-auth': { getServerSession: async () => null },
        '@/app/api/auth/[...nextauth]/route': { authOptions: {} }
      }
      await routeModule.link(specifier => {
        if (specifier === '@/lib/email') return module
        return new SyntheticModule(Object.keys(deps[specifier]), function () {
          for (const [key, value] of Object.entries(deps[specifier])) this.setExport(key, value)
        }, { context })
      })
      await routeModule.evaluate()
      const response = await routeModule.namespace.POST({ json: async () => data, headers: { get: () => null } })
      assert.equal(response.status, 201)
      assert.equal(calls.length, 2)
      assert.ok(calls.every(call => call.config.auth.user === (env.OVH_USER ?? env.EMAIL_USER)))
    })
  }
}
