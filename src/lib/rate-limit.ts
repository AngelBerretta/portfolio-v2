import { prisma } from './db';

const WINDOW_MINUTES = 15;
const MAX_ATTEMPTS = 5;

/**
 * Devuelve true si el identificador (IP) superó el límite de intentos
 * fallidos de login en la ventana de tiempo configurada.
 */
export async function isRateLimited(identifier: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

  const count = await prisma.loginAttempt.count({
    where: { identifier, createdAt: { gte: windowStart } },
  });

  return count >= MAX_ATTEMPTS;
}

/**
 * Registra un intento fallido. Aprovecha la llamada para barrer intentos
 * viejos fuera de la ventana — housekeeping liviano, sin necesidad de un
 * cron job aparte. Si el borrado falla no rompe nada (no se espera).
 */
export async function recordFailedAttempt(identifier: string): Promise<void> {
  await prisma.loginAttempt.create({ data: { identifier } });

  const cutoff = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  void prisma.loginAttempt
    .deleteMany({ where: { createdAt: { lt: cutoff } } })
    .catch(() => {});
}

/** Extrae la IP del visitante de los headers del request. */
export async function getClientIp(): Promise<string> {
  const { headers } = await import('next/headers');
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() ?? 'unknown';
}
