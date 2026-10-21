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
  company: 'Entreprise test', subject: 'Test', message: 'Message de test', createdAt: new Date().toISOString(),
  adminEmail: 'admin@example.test', success: true, timestamp: new Date().toISOString(),
  type: 'product', items: [{ type: 'custom', name: 'Article', quantity: 1, unitPrice: 10, totalPrice: 10 }]
}
async function setup(env, failure = null) {
  const calls = []
  const logs = { log: [], error: [] }
  const context = createContext({ process: { env }, console: {
    log(...args) { logs.log.push(args) }, error(...args) { logs.error.push(args) }
  } })
  const module = new SourceTextModule(source, { context })
  await module.link(() => new SyntheticModule(['default'], function () {
    this.setExport('default', { createTransport(config) {
      const call = { config }
      calls.push(call)
      return { async sendMail(mail) {
        call.mail = mail
        if (failure) throw failure
        return { messageId: 'mock-id' }
      } }
    } })
  }, { context }))
  await module.evaluate()
  return { module, calls, context, logs }
}

for (const NODE_ENV of ['development', 'production']) {
  test(NODE_ENV + ': all senders use OVH and the correct recipients', async () => {
    const { module, calls } = await setup({ ...credentials, NODE_ENV, EMAIL_PROVIDER: 'gmail', ADMIN_EMAIL: credentials.EMAIL_USER, CONTACT_EMAIL: credentials.EMAIL_USER, MAIL_TO: credentials.EMAIL_USER })
    assert.equal(module.namespace.isEmailConfigured(), true)
    for (const name of ['sendContactNotification', 'sendContactConfirmation', 'sendQuoteNotification', 'sendQuoteConfirmation', 'sendLoginAlert']) {
      assert.equal((await module.namespace[name](data)).success, true)
    }
    assert.equal(calls.length, 5)
    for (const { config, mail } of calls) {
      assert.equal(config.host, 'smtp.mail.ovh.net')
      assert.equal(config.port, 465)
      assert.equal(config.secure, true)
      assert.equal(config.auth.user, credentials.OVH_USER)
      assert.equal(config.auth.pass, credentials.OVH_PASSWORD)
      assert.equal(config.tls, undefined)
      assert.equal(mail.from, credentials.OVH_USER)
      assert.ok(!mail.html.includes('@gmail.com'))
    }
    assert.deepEqual(calls.map(c => c.mail.to), [credentials.OVH_USER, data.email, credentials.OVH_USER, data.email, credentials.OVH_USER])
    assert.deepEqual(calls.map(c => c.mail.replyTo), [data.email, undefined, data.email, undefined, undefined])
    for (const field of ['name', 'email', 'phone', 'company', 'subject', 'message']) {
      assert.ok(calls[0].mail.html.includes(data[field]))
      assert.ok(calls[0].mail.text.includes(data[field]))
    }
    assert.ok(calls[1].mail.html.includes('généralement sous 24h'))
  })
}
for (const key of ['OVH_USER', 'OVH_PASSWORD']) {
  test(key + ': missing OVH credentials never fall back to legacy credentials', async () => {
    for (const value of [undefined, '', '   ']) {
      const { module, calls } = await setup({ ...credentials, [key]: value })
      assert.equal(module.namespace.isEmailConfigured(), false)
      const result = await module.namespace.sendContactNotification(data)
      assert.equal(result.success, false)
      assert.match(result.error, /OVH_USER et OVH_PASSWORD/)
      assert.equal(calls.length, 0)
    }
  })
}
test('SMTP failure never falls back', async () => {
  const { module, calls } = await setup(credentials, new Error('SMTP unavailable'))
  assert.equal((await module.namespace.sendQuoteNotification(data)).success, false)
  assert.equal(calls.length, 1)
})

test('OVH authentication rejection is reported without fallback', async () => {
  const failure = Object.assign(new Error('Invalid login: 535 Authentication failed'), { code: 'EAUTH' })
  const { module, calls, logs } = await setup(credentials, failure)
  const result = await module.namespace.sendContactNotification(data)
  assert.equal(result.success, false)
  assert.equal(result.error, failure.message)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].config.host, 'smtp.mail.ovh.net')
  assert.equal(logs.log.length, 0)
  assert.equal(logs.error[0][1].code, 'EAUTH')
})

test('email source has no legacy provider or recipient configuration', () => {
  assert.doesNotMatch(source, /gmail|EMAIL_PROVIDER|EMAIL_USER|EMAIL_PASSWORD|GMAIL_USER|GMAIL_APP_PASSWORD|ADMIN_EMAIL|CONTACT_EMAIL|MAIL_TO/i)
})
test('failed login alerts go to the official mailbox', async () => {
  const { module, calls } = await setup(credentials)
  await module.namespace.sendLoginAlert({ ...data, success: false, adminEmail: undefined, failedEmail: 'someone@gmail.com' })
  assert.equal(calls[0].mail.to, credentials.OVH_USER)
})
  for (const route of ['contact', 'quotes']) {
    test(`${route} route sends with only OVH credentials`, async () => {
      const env = { OVH_USER: credentials.OVH_USER, OVH_PASSWORD: credentials.OVH_PASSWORD }
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
      assert.ok(calls.every(call => call.config.auth.user === env.OVH_USER))
    })
  }
