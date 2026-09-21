import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function homeAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  // Un ancien JWT ne suffit pas après révocation du rôle ou désactivation.
  const admin = await prisma.admin.findUnique({ where: { id: session.user.id }, select: { id: true, role: true, active: true } })
  return admin?.active && ['ADMIN', 'SUPER_ADMIN'].includes(admin.role) ? admin : null
}
export function forbidden() {
  return NextResponse.json({ error: 'Accès administrateur requis' }, { status: 403 })
}
export function apiError(error) {
  if (error?.name === 'ZodError') return NextResponse.json({ error: error.issues[0]?.message || 'Données invalides' }, { status: 400 })
  if (error instanceof SyntaxError) return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  if (error?.code === 'P2025') return NextResponse.json({ error: 'Contenu introuvable' }, { status: 404 })
  if (['P2002', 'P2034'].includes(error?.code)) return NextResponse.json({ error: 'Modification concurrente : rechargez puis réessayez' }, { status: 409 })
  console.error('Home content API:', error?.code || error?.name)
  return NextResponse.json({ error: 'Contenu indisponible. Vérifiez la connexion et les migrations de la base.' }, { status: 503 })
}
