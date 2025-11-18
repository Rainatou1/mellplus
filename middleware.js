// middleware.js (à placer à la racine du projet, pas dans app/)
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Si l'utilisateur n'est pas connecté, il sera automatiquement redirigé vers la page de login
    return NextResponse.next()
  },
  {
    callbacks: {
      // Cette fonction vérifie si l'utilisateur est autorisé
      authorized: ({ token }) => {
        // Retourne true si l'utilisateur a un token valide
        return !!token
      },
    },
    pages: {
      signIn: '/admin/login', // Page de connexion personnalisée
    },
  }
)

// Configuration des routes protégées
export const config = {
  matcher: [
    // Protéger toutes les routes admin SAUF la page de login
    '/admin/((?!login).*)',
    // Vous pouvez ajouter d'autres routes protégées ici
  ],
}