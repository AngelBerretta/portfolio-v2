import { auth } from '@/auth';

/**
 * Verifica que haya una sesión activa.
 * Llamar al inicio de cada Server Action que requiera autenticación.
 * Lanza un error si no hay sesión — el catch del action lo convierte en ActionResult.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}