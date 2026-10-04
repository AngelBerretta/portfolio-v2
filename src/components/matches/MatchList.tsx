'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CircleCheck,
  CodeXml,
  Globe,
  Hammer,
  Layers,
  LayoutTemplate,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Reveal } from '@/components/shared/Reveal';
import { MatchCard } from './MatchCard';
import type { ProjectCardData } from './types';

interface CategoryTab {
  id: string;
  label: string;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  all: Layers,
  fullstack: CodeXml,
  frontend: LayoutTemplate,
  landing: Globe,
};

const gridClass = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

function GroupHeading({
  icon: Icon,
  title,
  hint,
  count,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
  count: number;
}) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-border-subtle" />
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-full border border-border-subtle bg-bg-card px-4 py-1.5">
        <Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <span className="text-xs text-text-muted">· {hint}</span>
        <span className="rounded-md bg-bg-elevated px-1.5 py-0.5 text-[10px] font-bold text-text-secondary">
          {count}
        </span>
      </div>
      <div className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}

/**
 * Lista de proyectos con filtro por categoría.
 *  - titulares: terminados y online. suplentes: en desarrollo.
 *  - Al cambiar de filtro se remonta la grilla (key) y las tarjetas se
 *    vuelven a revelar con stagger: reemplaza el AnimatePresence viejo.
 */
export function MatchList({
  titulares,
  suplentes,
  categories,
  showFilters = true,
  viewAll,
}: {
  titulares: ProjectCardData[];
  suplentes: ProjectCardData[];
  categories: readonly CategoryTab[];
  /** El home muestra pocos proyectos destacados: ahí el filtro sobra. */
  showFilters?: boolean;
  /** Link "Ver todos" (solo en el home). */
  viewAll?: { href: string; count: number };
}) {
  const [active, setActive] = useState('all');

  const matches = (p: ProjectCardData) => active === 'all' || p.category === active;
  const shownTitulares = titulares.filter(matches);
  const shownSuplentes = suplentes.filter(matches);
  const total = shownTitulares.length + shownSuplentes.length;

  // Los encabezados "Titulares / En el banco" solo aportan cuando hay suplentes
  // que distinguir; si todo es titular, sobran.
  const showHeadings = shownSuplentes.length > 0;

  const countFor = (id: string) =>
    id === 'all'
      ? titulares.length + suplentes.length
      : [...titulares, ...suplentes].filter((p) => p.category === id).length;

  return (
    <div>
      {showFilters && (
        <Reveal delay={0.1} className="mb-12">
          <div
            role="group"
            aria-label="Filtrar proyectos por categoría"
            className="flex flex-wrap justify-center gap-2"
          >
            {categories.map((cat) => {
              const isActive = active === cat.id;
              const Icon = CATEGORY_ICONS[cat.id] ?? Layers;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActive(cat.id)}
                  aria-pressed={isActive}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors duration-200',
                    isActive
                      ? 'border-accent bg-accent text-text-inverse'
                      : 'border-border bg-bg-card text-text-secondary hover:border-accent/50 hover:text-text-primary'
                  )}
                >
                  <Icon size={15} aria-hidden="true" />
                  {cat.label}
                  <span
                    className={cn(
                      'min-w-5 rounded-md px-1.5 py-0.5 text-center text-[10px] font-bold',
                      isActive ? 'bg-text-inverse/15 text-text-inverse' : 'bg-bg-elevated text-text-muted'
                    )}
                  >
                    {countFor(cat.id)}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      )}

      <div key={active} className="space-y-14">
        {shownTitulares.length > 0 && (
          <div>
            {showHeadings && (
              <GroupHeading
                icon={CircleCheck}
                title="Titulares"
                hint="terminados y online"
                count={shownTitulares.length}
              />
            )}
            <div className={gridClass}>
              {shownTitulares.map((project, i) => (
                <MatchCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        )}

        {shownSuplentes.length > 0 && (
          <div>
            <GroupHeading
              icon={Hammer}
              title="En el banco"
              hint="en construcción"
              count={shownSuplentes.length}
            />
            <div className={gridClass}>
              {shownSuplentes.map((project, i) => (
                <MatchCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        )}

        {total === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border-subtle bg-bg-card">
              <Layers size={28} className="text-text-muted" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-text-secondary">
              No hay proyectos en esta categoría todavía.
            </p>
          </div>
        )}
      </div>

      {total > 0 && (
        <p className="mt-12 text-center text-sm text-text-secondary">
          <span className="font-bold text-accent">{shownTitulares.length}</span> proyecto
          {shownTitulares.length !== 1 && 's'} online
          {shownSuplentes.length > 0 && (
            <>
              {' · '}
              <span className="font-bold text-pos-playoff">{shownSuplentes.length}</span> en construcción
            </>
          )}
        </p>
      )}

      {viewAll && (
        <div className="mt-8 flex justify-center">
          <Link
            href={viewAll.href}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-transparent bg-accent px-6 text-base font-medium text-text-inverse transition-all duration-200 hover:bg-accent-dim"
          >
            Ver todos los proyectos ({viewAll.count})
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}