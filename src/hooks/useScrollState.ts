import { useScrollContext, type ScrollContextValue } from '@/context/ScrollContext';

/**
 * Wrapper de compatibilidad sobre ScrollContext.
 *
 * Los componentes (Navbar, SideNav, BackToTop, ScrollProgress) llaman a
 * useScrollState() como si cada uno tuviera su propio listener, pero por
 * debajo todos comparten el único listener del <ScrollProvider>.
 * Requiere que el componente esté dentro de <ScrollProvider>
 * (ver src/app/(site)/layout.tsx).
 */
export function useScrollState(): ScrollContextValue {
  return useScrollContext();
}