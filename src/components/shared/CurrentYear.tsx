'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Año actual del visitante. Isla cliente mínima para que el Footer pueda ser
 * server component.
 *
 * Por qué no `new Date()` directo en el Footer: con cacheComponents, leer la
 * hora en el servidor durante el prerender es un error de build, y hardcodear
 * el año lo deja viejo. Con useSyncExternalStore el servidor usa el snapshot
 * de servidor (vacío, sin tocar la fecha) y el cliente pone el año real justo
 * después de hidratar, sin mismatch. Mismo patrón que KitContext.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null
  );

  return <>{year}</>;
}
