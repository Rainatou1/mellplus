import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { homeAdmin, forbidden, apiError } from '@/lib/homeAdmin'
import { reorderSchema } from '@/lib/homeValidation'

export async function PUT(request) {
  try {
    if (!await homeAdmin()) return forbidden()
    const { slideOrders } = reorderSchema.parse(await request.json())
    await prisma.$transaction(slideOrders.map(({ id, order }) => prisma.carousel.update({ where: { id }, data: { order } })))
    return NextResponse.json({ success: true })
  } catch (error) { return apiError(error) }
}
