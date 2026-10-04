'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/**
 * true si el usuario pidió reducir el movimiento. Reactivo: si cambia la
 * preferencia con la página abierta, el componente se actualiza solo.
 * En el servidor devuelve false (se asume "movimiento OK"); el cliente
 * corrige después de hidratar si hace falta.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}