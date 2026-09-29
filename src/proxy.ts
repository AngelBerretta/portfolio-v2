import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    '/admin/:path*',
    // excluimos archivos estáticos y el api de auth para que no se bloqueen a sí mismos
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};