import { DEFAULT_SLIDES, DEFAULT_BLOCKS } from './homeDefaults.js'
import { publicSlide, publicBlock } from './homeContent.js'

export async function loadHomeContent(prisma) {
  // Chaque source peut être indisponible indépendamment pendant le déploiement.
  const [carousel, visual] = await Promise.allSettled([
    prisma.carousel.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] }),
    prisma.visualBlock.findMany({ where: { key: { in: Object.values(DEFAULT_BLOCKS).map(block => block.key) } } })
  ])
  const configured = carousel.status === 'fulfilled' && carousel.value.length > 0
  const slides = configured ? carousel.value.filter(slide => slide.active).map(publicSlide) : DEFAULT_SLIDES
  const blocks = Object.fromEntries(Object.entries(DEFAULT_BLOCKS).map(([side, fallback]) => {
    const stored = visual.status === 'fulfilled' && visual.value.find(block => block.key === fallback.key)
    return [side, publicBlock(stored || fallback)]
  }))
  if (carousel.status === 'rejected' || visual.status === 'rejected') console.error('Accueil : source indisponible, valeurs de secours utilisées')
  return { slides, blocks }
}
