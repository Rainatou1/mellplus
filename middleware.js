

// middleware.js
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

const MAINTENANCE_MODE = true; // 👈 false pour désactiver
const BYPASS_COOKIE = 'bypass_maintenance';
const BYPASS_SECRET = 'mellplusi-1907'; // 👈 change cette valeur

export default withAuth(
function middleware(req) {
const { pathname } = req.nextUrl;

// Laisser passer : assets, page maintenance, endpoint bypass, routes admin
if (
pathname.startsWith('/_next') ||
pathname.startsWith('/maintenance') ||
pathname.startsWith('/api/set-bypass') ||
pathname.startsWith('/admin') ||
pathname.startsWith('/favicon')
) {
return NextResponse.next();
}

// Si maintenance désactivée, tout passe
if (!MAINTENANCE_MODE) {
return NextResponse.next();
}

// Vérifier le cookie de bypass
const cookie = req.cookies.get(BYPASS_COOKIE);
if (cookie?.value === BYPASS_SECRET) {
return NextResponse.next();
}

// Sinon → page maintenance
return NextResponse.redirect(new URL('/maintenance', req.url));
},
{
callbacks: {
authorized: ({ token, req }) => {
const { pathname } = req.nextUrl;
// Appliquer l'auth uniquement sur les routes admin
if (pathname.startsWith('/admin')) {
return !!token;
}
// Pour toutes les autres routes, laisser passer (le middleware gère)
return true;
},
},
pages: {
signIn: '/admin/login',
},
}
)

export const config = {
matcher: ['/(.*)',],
}