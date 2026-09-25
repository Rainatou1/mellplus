// Read-only audit. Never prints connection credentials or product contents.
const { loadEnvConfig } = require('@next/env')
const { PrismaClient } = require('@prisma/client')
const { createHash } = require('node:crypto')
const { readFile, writeFile, mkdir } = require('node:fs/promises')
const { dirname } = require('node:path')
const assert = require('node:assert/strict')
loadEnvConfig(process.cwd())
const prisma = new PrismaClient()
async function main() {
  const mode = process.argv[2] || 'audit'
  if (!['audit', 'snapshot', 'verify'].includes(mode)) throw new Error('Unknown audit mode')
  const columns = await prisma.$queryRaw`SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Product' ORDER BY ordinal_position`
  console.log(JSON.stringify({ columns }, null, 2))
  const counts = await prisma.$queryRaw`SELECT count(*)::int AS products, count(*) FILTER (WHERE "publishedAt" IS NOT NULL)::int AS published, count(*) FILTER (WHERE discount > 0)::int AS legacy_promotions, count(*) FILTER (WHERE discount > 0 AND "publishedAt" IS NOT NULL)::int AS public_promotions FROM "Product"`
  const categories = await prisma.$queryRaw`SELECT category, count(*)::int AS products FROM "Product" GROUP BY category ORDER BY category`
  const migrations = await prisma.$queryRaw`SELECT migration_name, finished_at, rolled_back_at FROM "_prisma_migrations" ORDER BY started_at`
  console.log(JSON.stringify({ counts, categories, migrations }, null, 2))
  if (mode === 'audit') return

  // JSONB's canonical representation retains every existing column, including dates,
  // arrays and decimal precision. Only the newly added flag is excluded from hashes.
  const rows = await prisma.$queryRaw`SELECT id, (to_jsonb(p) - 'isPromotion')::text AS original, COALESCE(discount > 0, false) AS expected, to_jsonb(p)->>'isPromotion' AS promotion FROM "Product" p ORDER BY id`
  const enumValues = await prisma.$queryRaw`SELECT e.enumlabel FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid WHERE t.typname = 'ProductCategory' ORDER BY e.enumsortorder`
  const products = rows.map(row => ({ id: row.id, hash: createHash('sha256').update(row.original).digest('hex'), expected: row.expected }))
  const path = process.argv[3]
  if (!path) throw new Error('A snapshot path is required')
  if (mode === 'snapshot') {
    assert.ok(!columns.some(column => column.column_name === 'isPromotion'), 'Snapshot must precede this migration')
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, JSON.stringify({ columns, categories, enumValues, products }, null, 2), { flag: 'wx', mode: 0o600 })
    console.log('Integrity snapshot saved (hashes only; NOT a database backup). Products:', products.length)
  } else {
    const before = JSON.parse(await readFile(path, 'utf8'))
    assert.deepEqual(columns.filter(column => column.column_name !== 'isPromotion'), before.columns, 'Existing column definitions changed')
    const flag = columns.find(column => column.column_name === 'isPromotion')
    assert.ok(flag && flag.data_type === 'boolean' && flag.is_nullable === 'NO' && flag.column_default === 'false', 'Incorrect promotion column')
    assert.deepEqual(products, before.products, 'Product IDs or original data changed')
    assert.deepEqual(categories, before.categories, 'Category counts changed')
    assert.deepEqual(enumValues, before.enumValues, 'Category definitions changed')
    assert.ok(rows.every(row => row.promotion === String(row.expected)), 'Promotion backfill differs from previous classification')
    console.log('Verified: all products and original values unchanged; categories and legacy promotions preserved.')
  }
}
main().catch(error => {
  const reason = ['Environment variable not found', "Can't reach database server", 'Authentication failed', 'Query engine', 'query engine', 'Server has closed the connection'].find(text => error.message.includes(text))
  console.error('Product audit failed:', error.errorCode || error.code || error.name, reason || (error.code === 'ERR_ASSERTION' ? 'Integrity mismatch: do not deploy; compare with the pre-migration snapshot.' : '(connection details omitted)'))
  process.exitCode = 1
}).finally(() => prisma.$disconnect())
