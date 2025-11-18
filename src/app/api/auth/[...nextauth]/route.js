// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis')
        }

        // Récupérer l'admin depuis la base de données
        const admin = await prisma.admin.findUnique({
          where: { 
            email: credentials.email,
            active: true // Vérifier que le compte est actif
          }
        })

        if (!admin) {
          throw new Error('Identifiants invalides')
        }

        // Vérifier le mot de passe
        const isPasswordValid = await compare(credentials.password, admin.password)
        
        if (!isPasswordValid) {
          throw new Error('Identifiants invalides')
        }

        // Mettre à jour la dernière connexion
        await prisma.admin.update({
          where: { id: admin.id },
          data: { 
            lastLogin: new Date(),
            lastIp: credentials.ip || null
          }
        })

        // Retourner les données de l'utilisateur
        return {
          id: admin.id,
          email: admin.email,
          name: `${admin.firstName} ${admin.lastName}`,
          role: admin.role,
          image: admin.avatar
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // Update token when session update is triggered
      if (trigger === 'update' && session?.name) {
        token.name = session.name
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        // Use updated name from token if available
        if (token.name) {
          session.user.name = token.name
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 heures
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }