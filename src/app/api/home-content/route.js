import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { loadHomeContent } from '@/lib/loadHomeContent'

export const dynamic = 'force-dynamic'
export async function GET() {
  return NextResponse.json(await loadHomeContent(prisma), { headers: { 'Cache-Control': 'no-store' } })
}
