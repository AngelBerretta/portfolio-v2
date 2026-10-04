import type { SectionId } from '@/hooks/useActiveSection';
import type { NavItem } from '@/types';

export interface SectionNavItem extends NavItem {
  /** Debe coincidir con el id de la <section> y con SECTIONS en useActiveSection */
  id: SectionId;
  /** Significado en lenguaje llano — se usa como tooltip y subtítulo en mobile,
   *  para que la metáfora del fútbol nunca confunda a un reclutador. */
  hint: string;
}

/**
 * Única fuente de verdad de la navegación. Para renombrar una sección
 * (o volver a labels neutros) se cambia solo acá.
 *
 * href usa "/#id" (no solo "#id") para que los links también funcionen
 * desde subpáginas como /partidos: navegan al home y scrollean a la sección.
 */
export const SECTION_ITEMS: SectionNavItem[] = [
  { id: 'hero', label: 'Inicio', hint: 'Inicio', href: '/#hero' },
  { id: 'about', label: 'Sobre mí', hint: 'Quién soy', href: '/#about' },
  { id: 'skills', label: 'Plantel', hint: 'Tecnologías', href: '/#skills' },
  { id: 'projects', label: 'Partidos', hint: 'Proyectos', href: '/#projects' },
  { id: 'contact', label: 'Fichaje', hint: 'Contacto', href: '/#contact' },
];

/** El navbar de escritorio omite "Inicio": el logo ya cumple esa función. */
export const NAV_LINKS = SECTION_ITEMS.filter((item) => item.id !== 'hero');