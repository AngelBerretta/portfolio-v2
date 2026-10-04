'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

// Labels para los segmentos de URL que no se ven bien "humanizados" a secas.
// Agregá acá las rutas nuevas que lo necesiten.
const SEGMENT_LABELS: Record<string, string> = {
  partidos: 'Partidos',
};

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function labelFor(segment: string): string {
  const known = SEGMENT_LABELS[segment];
  if (known) return known;
  const text = safeDecode(segment).replace(/-/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Migas de pan para las subpáginas (ej: Inicio › Partidos).
 * En el home no renderiza nada. Incluye el espacio superior para que el
 * contenido no quede tapado por el navbar fijo.
 */
export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, i) => ({
    label: labelFor(segment),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-24 sm:px-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-text-muted">
          <li>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
            >
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              Inicio
            </Link>
          </li>

          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-text-disabled" aria-hidden="true" />
                {isLast ? (
                  <span aria-current="page" className="font-medium text-text-primary">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="transition-colors hover:text-accent">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}