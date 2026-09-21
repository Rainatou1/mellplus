import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { homeAdmin, forbidden, apiError } from '@/lib/homeAdmin'
import { slideSchema } from '@/lib/homeValidation'
import { publicSlide } from '@/lib/homeContent'

export const dynamic = 'force-dynamic'
export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams
    const adminView = params.get('admin') === 'true'
    if (adminView && !await homeAdmin()) return forbidden()
    const limit = params.get('limit')
    if (limit !== null && (!/^\d+$/.test(limit) || Number(limit) < 1 || Number(limit) > 1000)) return NextResponse.json({ error: 'Limite invalide' }, { status: 400 })
    const slides = await prisma.carousel.findMany({
      where: adminView && params.get('active') !== 'true' ? {} : { active: true },
      ...(limit ? { take: Number(limit) } : {}), orderBy: [{ order: 'asc' }, { id: 'asc' }]
    })
    return NextResponse.json({ slides: adminView ? slides : slides.map(publicSlide), total: slides.length })
  } catch (error) { return apiError(error) }
}
export async function POST(request) {
  try {
    const admin = await homeAdmin()
    if (!admin) return forbidden()
    const data = slideSchema.parse(await request.json())
    const slide = await prisma.$transaction(async tx => {
      if (data.order === undefined) {
        const last = await tx.carousel.findFirst({ orderBy: { order: 'desc' }, select: { order: true } })
        data.order = (last?.order ?? -1) + 1
      }
      return tx.carousel.create({ data: { ...data, createdBy: admin.id } })
    }, { isolationLevel: 'Serializable' })
    return NextResponse.json({ success: true, slide }, { status: 201 })
  } catch (error) { return apiError(error) }
}
