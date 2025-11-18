import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test basic database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`

    // Test product count
    const productCount = await prisma.product.count()

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        connectionTest: result,
        productCount,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Database test error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      meta: error.meta
    })

    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: {
        message: error.message,
        code: error.code,
        meta: error.meta
      }
    }, { status: 500 })
  }
}