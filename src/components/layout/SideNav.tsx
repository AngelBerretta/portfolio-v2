'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useScrollState } from '@/hooks/useScrollState';
import { useActiveSection } from '@/hooks/useActiveSection';
import { SECTION_ITEMS } from './nav-items';

/**
 * Puntos de navegación fijos al costado derecho (solo ≥ lg).
 * Aparecen después de scrollear un poco y marcan la sección activa.
 */
export function SideNav() {
  const pathname = usePathname();
  const { isSideNavVisible } = useScrollState();
  const activeId = useActiveSection();

  // Solo existe en el home: las demás rutas no tienen estas secciones.
  if (pathname !== '/') return null;

  return (
    <nav
      aria-label="Secciones de la página"
      // inert: mientras está oculto no recibe foco ni lo leen los lectores de pantalla
      inert={!isSideNavVisible}
      className={cn(
        'fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 transition-all duration-300 lg:block',
        isSideNavVisible
          ? 'translate-x-0 opacity-100'
          : 'pointer-events-none translate-x-4 opacity-0'
      )}
    >
      <ul className="flex flex-col items-end">
        {SECTION_ITEMS.map((item) => {
          const active = activeId === item.id;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-label={item.hint === item.label ? item.label : `${item.label} — ${item.hint}`}
                aria-current={active ? 'location' : undefined}
                className="group relative flex items-center justify-end p-2"
              >
                <span
                  className={cn(
                    'pointer-events-none absolute right-8 whitespace-nowrap rounded-md border border-border bg-bg-card px-2.5 py-1 text-xs text-text-primary opacity-0 transition-opacity duration-150',
                    'group-hover:opacity-100 group-focus-visible:opacity-100'
                  )}
                >
                  {item.label}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'block h-2.5 w-2.5 rounded-full border transition-all duration-200',
                    active
                      ? 'scale-125 border-accent bg-accent'
                      : 'border-text-muted bg-transparent group-hover:border-accent'
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}