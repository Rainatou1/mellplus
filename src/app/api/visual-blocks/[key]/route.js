import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_BLOCKS } from '@/lib/homeDefaults'
import { homeAdmin, forbidden, apiError } from '@/lib/homeAdmin'
import { blockSchema } from '@/lib/homeValidation'

export async function PUT(request, { params }) {
  try {
    if (!await homeAdmin()) return forbidden()
    const { key } = await params
    if (!Object.values(DEFAULT_BLOCKS).some(block => block.key === key)) return NextResponse.json({ error: 'Emplacement inconnu' }, { status: 404 })
    const data = blockSchema.parse(await request.json())
    const block = await prisma.visualBlock.upsert({ where: { key }, create: { key, ...data }, update: data })
    return NextResponse.json({ success: true, block })
  } catch (error) { return apiError(error) }
}
