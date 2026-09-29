'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { isRateLimited, recordFailedAttempt, getClientIp } from '@/lib/rate-limit';

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const ip = await getClientIp();

  // Chequeo de rate limit ANTES de tocar Auth.js — así nunca le pegamos
  // a la base de AdminUser ni hacemos el bcrypt.compare si ya están baneados.
  if (await isRateLimited(ip)) {
    return { error: 'Demasiados intentos. Esperá unos minutos antes de volver a intentar.' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/admin/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Solo contamos como "intento fallido" lo que realmente fue un
      // rechazo de credenciales, no errores de infraestructura.
      await recordFailedAttempt(ip);

      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Email o contraseña incorrectos.' };
        default:
          return { error: 'Ocurrió un error. Intentá de nuevo.' };
      }
    }
    // signIn con redirectTo lanza un NEXT_REDIRECT — hay que re-lanzarlo
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/admin/login' });
}
