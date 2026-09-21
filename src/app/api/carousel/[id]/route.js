import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { homeAdmin, forbidden, apiError } from '@/lib/homeAdmin'
import { slideUpdateSchema } from '@/lib/homeValidation'
import { publicSlide } from '@/lib/homeContent'

export const dynamic = 'force-dynamic'
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const adminView = new URL(request.url).searchParams.get('admin') === 'true'
    if (adminView && !await homeAdmin()) return forbidden()
    const slide = await prisma.carousel.findUnique({ where: { id } })
    if (!slide || (!adminView && !slide.active)) return NextResponse.json({ error: 'Slide introuvable' }, { status: 404 })
    return NextResponse.json({ slide: adminView ? slide : publicSlide(slide) })
  } catch (error) { return apiError(error) }
}
export async function PUT(request, { params }) {
  try {
    if (!await homeAdmin()) return forbidden()
    const { id } = await params
    const data = slideUpdateSchema.parse(await request.json())
    const slide = await prisma.carousel.update({ where: { id }, data })
    return NextResponse.json({ success: true, slide })
  } catch (error) { return apiError(error) }
}
export async function DELETE(request, { params }) {
  try {
    if (!await homeAdmin()) return forbidden()
    const { id } = await params
    // Les trous dans les positions sont sans effet ; préserver les autres slides.
    await prisma.carousel.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) { return apiError(error) }
}
