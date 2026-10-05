import Link from 'next/link';
import { Heart } from 'lucide-react';
import { CurrentYear } from './CurrentYear';
import { MatchdayBadge } from './MatchdayBadge';
import { PitchDivider } from './PitchDivider';

const STACK = ['Next.js', 'TypeScript', 'Tailwind', 'GSAP'] as const;

/**
 * Pie del sitio público. Server component: el único trozo cliente es
 * CurrentYear. Se monta en app/(site)/layout.tsx, justo después de <main>.
 *
 * El "·" junto al año es el acceso discreto al panel de administración
 * (igual que en la versión anterior).
 */
export function Footer() {
  return (
    <footer>
      <PitchDivider className="mx-auto max-w-7xl px-4 sm:px-6" />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 pb-10 pt-6 text-center sm:px-6 md:flex-row md:text-left">
        <p className="font-display text-lg font-bold tracking-tight text-text-primary">
          Angel<span className="text-accent">.</span>dev
        </p>

        <div className="flex flex-col items-center gap-3">
          {/* Fin del partido: cierra la metáfora; el significado va en el texto. */}
          <MatchdayBadge code="FIN" title="Llegaste al final de la página">
            Gracias por visitar
          </MatchdayBadge>

          <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-text-muted">
            Hecho con
            <Heart className="h-3 w-3 fill-current text-loss" aria-hidden="true" />
            <span className="sr-only">cariño</span>
            por <span className="font-medium text-text-secondary">Angel Berretta</span>
            <Link
              href="/admin/login"
              prefetch={false}
              aria-label="Panel de administración"
              className="-mx-1 px-2 py-1 transition-colors hover:text-accent"
            >
              ·
            </Link>
            <CurrentYear />
          </p>
        </div>

        <ul aria-label="Tecnologías del sitio" className="flex flex-wrap items-center justify-center gap-1.5">
          {STACK.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-border-subtle bg-bg-card px-2 py-0.5 text-xs text-text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
