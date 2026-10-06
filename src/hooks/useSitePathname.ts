'use client';

import { usePathname } from 'next/navigation';

/**
 * usePathname() devuelve "/index" al prerenderizar la home en el servidor,
 * pero "/" en el navegador. Esa diferencia causaba el error de hidratación
 * #418. Acá se normaliza para que ambos lados vean lo mismo.
 */
export function useSitePathname(): string {
  const pathname = usePathname();
  if (pathname === '/index' || pathname === '/index/') return '/';
  return pathname;
}