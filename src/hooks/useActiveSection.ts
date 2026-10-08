import { useScrollContext } from '@/context/ScrollContext';
import type { SectionId } from '@/lib/sections';

// nav-items.ts y NavbarMobileMenu siguen importando el tipo desde acá.
export type { SectionId };

/**
 * Sección activa según el scroll spy. Ya no calcula nada: lee del
 * ScrollProvider, que tiene la única instancia del observer.
 */
export function useActiveSection(): SectionId {
  return useScrollContext().activeSection;
}