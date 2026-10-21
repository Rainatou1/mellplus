import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { SourceTextModule, SyntheticModule } from 'node:vm'
import { createRequire } from 'node:module'
import * as React from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import { renderToStaticMarkup } from 'react-dom/server'
import * as icons from 'lucide-react'

const require = createRequire(import.meta.url)
const { transform } = require('next/dist/build/swc')

async function loadComponents(file, exports) {
  const source = await readFile(new URL(`../src/app/${file}`, import.meta.url), 'utf8')
  const { code } = await transform(`${source}\nexport { ${exports} };`, {
    filename: file,
    jsc: { parser: { syntax: 'ecmascript', jsx: true }, target: 'es2020', transform: { react: { runtime: 'automatic' } } },
    module: { type: 'es6' }
  })
  const dependencies = {
    react: React,
    'react/jsx-runtime': jsxRuntime,
    'lucide-react': icons,
    'next/link': { default: ({ children, ...props }) => React.createElement('a', props, children) },
    'next/image': { default: ({ unoptimized, ...props }) => React.createElement('img', props) },
    'react-hot-toast': { default: {} },
    '@/components/admin/ImageUpload': { default: () => null },
    '@/lib/categoryMapping': { getCategoryDisplayName: name => name }
  }
  const module = new SourceTextModule(code)
  await module.link(specifier => {
    const values = dependencies[specifier]
    assert.ok(values, `Unexpected dependency: ${specifier}`)
    return new SyntheticModule(Object.keys(values), function () {
      for (const [key, value] of Object.entries(values)) this.setExport(key, value)
    })
  })
  await module.evaluate()
  return module.namespace
}

test('promotion cards show quote requests or plain prices without inventing reductions', async () => {
  const { PromoProductCard } = await loadComponents('promotions/page.js', 'PromoProductCard')
  const product = { id: 'p', name: 'Produit', quantity: 10, inStock: true, isPromotion: true }
  const render = props => renderToStaticMarkup(React.createElement(PromoProductCard, { product: { ...product, ...props } }))
  const quote = render({ price: null, discount: null })
  assert.match(quote, /Sur devis/)
  assert.match(quote, /Demander un devis/)
  assert.doesNotMatch(quote, /line-through|Économies:|-%|-0%/)
  for (const discount of [null, 0]) {
    const plain = render({ price: '10000', discount })
    assert.match(plain, /Acheter/)
    assert.doesNotMatch(plain, /line-through|Économies:|-%|-0%/)
  }
  const reduced = render({ price: '10000', discount: 20 })
  assert.match(reduced, /-20%/)
  assert.match(reduced, /line-through/)
  assert.match(reduced, /Économies:/)
})

test('product form keeps promotion independent of publication and price/discount optional', async () => {
  const { ProductModal } = await loadComponents('admin/products/page.js', 'ProductModal')
  for (const isPromotion of [false, true]) {
    for (const publishedAt of [null, '2026-09-01T12:00:00Z']) {
      const html = renderToStaticMarkup(React.createElement(ProductModal, { product: { isPromotion, publishedAt }, onClose() {}, onSave() {} }))
      const promotion = html.match(/<input[^>]+type="checkbox"[^>]*\/>\s*<span[^>]*>Promotion<\/span>/)?.[0]
      const published = html.match(/<input[^>]+type="checkbox"[^>]*\/>\s*<span[^>]*>Publier le produit<\/span>/)?.[0]
      assert.ok(promotion)
      assert.ok(published)
      assert.equal(promotion.includes('checked=""'), isPromotion)
      assert.equal(published.includes('checked=""'), Boolean(publishedAt))
      const price = html.match(/<input[^>]+type="number"[^>]+step="0.01"[^>]*>/)?.[0]
      const discount = html.match(/<input[^>]+type="number"[^>]+max="100"[^>]*>/)?.[0]
      assert.ok(price && discount)
      assert.doesNotMatch(price, /required/)
      assert.doesNotMatch(discount, /required/)
    }
  }
})
