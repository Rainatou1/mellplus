import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_SLIDES, DEFAULT_BLOCKS } from '@/lib/homeDefaults'
import { homeAdmin, forbidden, apiError } from '@/lib/homeAdmin'

export async function POST() {
  try {
    const admin = await homeAdmin()
    if (!admin) return forbidden()
    const imported = await prisma.$transaction(async tx => {
      const count = await tx.carousel.count()
      if (count === 0) await tx.carousel.createMany({ data: DEFAULT_SLIDES.map(({ id, ...slide }) => ({ ...slide, createdBy: admin.id })) })
      for (const block of Object.values(DEFAULT_BLOCKS)) {
        await tx.visualBlock.upsert({ where: { key: block.key }, create: block, update: {} })
      }
      return count === 0 ? DEFAULT_SLIDES.length : 0
    }, { isolationLevel: 'Serializable' })
    return NextResponse.json({ success: true, imported })
  } catch (error) { return apiError(error) }
}
