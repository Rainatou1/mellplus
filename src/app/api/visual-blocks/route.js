import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_BLOCKS } from '@/lib/homeDefaults'
import { publicBlock } from '@/lib/homeContent'
import { homeAdmin, forbidden, apiError } from '@/lib/homeAdmin'

export const dynamic = 'force-dynamic'
export async function GET(request) {
  try {
    const adminView = new URL(request.url).searchParams.get('admin') === 'true'
    if (adminView && !await homeAdmin()) return forbidden()
    const stored = await prisma.visualBlock.findMany({ where: { key: { in: Object.values(DEFAULT_BLOCKS).map(block => block.key) } } })
    const blocks = Object.fromEntries(Object.entries(DEFAULT_BLOCKS).map(([side, fallback]) => {
      const block = stored.find(row => row.key === fallback.key) || fallback
      return [side, adminView ? block : publicBlock(block)]
    }))
    return NextResponse.json({ blocks })
  } catch (error) { return apiError(error) }
}
