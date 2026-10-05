import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // Solo /admin necesita pasar por Auth.js: el callback `authorized` de
  // auth.config.ts devuelve `true` para cualquier otra ruta, así que
  // ejecutarlo en el home, en /partidos, en las imágenes o en el PDF del CV
  // solo sumaba latencia a cada request público.
  // (El layout de (protected) y las Server Actions vuelven a validar la
  // sesión por su cuenta, así que esto no reduce la seguridad.)
  matcher: ['/admin/:path*'],
};