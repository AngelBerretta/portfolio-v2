import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig: NextAuthConfig = {

  trustHost: true,

  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnLogin = nextUrl.pathname === '/admin/login';

      if (isOnAdmin && !isOnLogin) {
        if (isLoggedIn) return true;
        return false; // redirige a /admin/login automáticamente
      }

      return true;
    },
    jwt({ token, user }) {
      // la primera vez que se loguea, user está presente — lo metemos en el token
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      // exponemos id y email en el objeto de sesión accesible desde el cliente
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  providers: [Credentials({})], // stub — la lógica real va en auth.ts
};