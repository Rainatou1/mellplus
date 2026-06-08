import { NextResponse } from 'next/server';

const SECRET_VALUE = 'mellplusi-1907'; // 👈 même valeur que dans le middleware

export async function GET(request) {
const { searchParams } = new URL(request.url);
const key = searchParams.get('key');

if (key !== SECRET_VALUE) {
return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
}

const response = NextResponse.redirect(new URL('/', request.url));
response.cookies.set('bypass_maintenance', SECRET_VALUE, {
httpOnly: true,
secure: true,
maxAge: 60 * 60 * 24 * 7, // 7 jours
path: '/',
});

return response;
}