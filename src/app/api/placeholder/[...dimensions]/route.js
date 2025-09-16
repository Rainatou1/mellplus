import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params
    const dimensions = resolvedParams.dimensions.join('/')
    const [width = '300', height = '200'] = dimensions.split('/')

    // Create a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="system-ui, sans-serif" font-size="14">
          ${width}x${height}
        </text>
      </svg>
    `

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (error) {
    console.error('Error generating placeholder:', error)
    return NextResponse.json(
      { error: 'Error generating placeholder' },
      { status: 500 }
    )
  }
}