// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendLoginAlert } from '@/lib/email'
import { headers } from 'next/headers'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials, req) {
        // Récupérer les informations de la requête
        const headersList = await headers()
        const ip = headersList.get('x-forwarded-for') ||
                   headersList.get('x-real-ip') ||
                   'IP inconnue'
        const userAgent = headersList.get('user-agent') || 'Navigateur inconnu'

        if (!credentials?.email || !credentials?.password) {
          // Envoyer une alerte pour tentative sans identifiants
          try {
            await sendLoginAlert({
              failedEmail: credentials?.email || 'Non fourni',
              success: false,
              ip,
              userAgent,
              timestamp: new Date()
            })
          } catch (error) {
            console.error('Erreur envoi alerte:', error)
          }
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
          // Envoyer une alerte pour email inexistant
          try {
            await sendLoginAlert({
              failedEmail: credentials.email,
              success: false,
              ip,
              userAgent,
              timestamp: new Date()
            })
          } catch (error) {
            console.error('Erreur envoi alerte:', error)
          }
          throw new Error('Identifiants invalides')
        }

        // Vérifier le mot de passe
        const isPasswordValid = await compare(credentials.password, admin.password)

        if (!isPasswordValid) {
          // Envoyer une alerte pour mot de passe incorrect
          try {
            await sendLoginAlert({
              adminEmail: admin.email,
              failedEmail: credentials.email,
              success: false,
              ip,
              userAgent,
              timestamp: new Date()
            })
          } catch (error) {
            console.error('Erreur envoi alerte:', error)
          }
          throw new Error('Identifiants invalides')
        }

        // Mettre à jour la dernière connexion
        await prisma.admin.update({
          where: { id: admin.id },
          data: {
            lastLogin: new Date(),
            lastIp: ip
          }
        })

        // Envoyer une alerte pour connexion réussie
        try {
          await sendLoginAlert({
            adminEmail: admin.email,
            success: true,
            ip,
            userAgent,
            timestamp: new Date()
          })
        } catch (error) {
          console.error('Erreur envoi alerte:', error)
        }

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