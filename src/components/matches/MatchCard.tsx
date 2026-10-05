'use client';

import Image from 'next/image';
import { Clock, ExternalLink, Hammer, Star } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useRevealOnScroll } from '@/animations/useRevealOnScroll';
import { Badge } from '@/components/shared/Badge';
import { GitHubIcon } from '@/components/shared/icons';
import { categoryConfig, FALLBACK_CATEGORY } from './category-config';
import { ScoreBadge } from './ScoreBadge';
import { TagList } from './TagList';
import { isUpcoming, type ProjectCardData } from './types';

const isRealUrl = (url: string) => !!url && url !== '#';

function initialsOf(title: string) {
  const words = title.trim().split(/\s+/);
  const letters = words.length > 1 ? words.map((w) => w[0]).join('') : title.slice(0, 2);
  return letters.slice(0, 2).toUpperCase();
}

/**
 * Tarjeta de proyecto. Una sola para los dos estados:
 *  - Titular (terminado, online): captura + links a demo y código.
 *  - Suplente (en desarrollo): borde punteado, panel con iniciales, sin links
 *    (sus URLs suelen ser un placeholder), y un pie que explica el estado.
 */
export function MatchCard({ project, index }: { project: ProjectCardData; index: number }) {
  // Stagger por columna (3 columnas en desktop).
  const ref = useRevealOnScroll<HTMLElement>({ delay: (index % 3) * 0.08 });

  const upcoming = isUpcoming(project.status);
  const category = categoryConfig[project.category] ?? FALLBACK_CATEGORY;
  const hasImage = !upcoming && !!project.image;
  const isComingSoon = project.status === 'coming-soon';
  const FooterIcon = isComingSoon ? Clock : Hammer;

  return (
    <article
      ref={ref}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border bg-bg-card transition-all duration-300',
        'hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10',
        upcoming ? 'border-dashed border-border-subtle' : 'border-border'
      )}
    >
      {/* ── Media ───────────────────────────────────────── */}
      {hasImage ? (
        <div className="relative aspect-video overflow-hidden bg-bg-surface">
          {/* Sin `priority`: las cards nunca son el LCP (en el home están bajo
              el hero y arrancan con opacity 0 por el reveal), y precargarlas
              competía con el recurso que sí importa. next/image ya las carga
              en lazy. */}
          <Image
            src={project.image}
            alt={`Captura de ${project.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {project.featured && (
            <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-xs font-bold text-text-inverse shadow-lg">
              <Star size={10} fill="currentColor" aria-hidden="true" />
              Destacado
            </span>
          )}
          {/* Fondo casi opaco: sobre una captura clara, el verde translúcido no se lee. */}
          <ScoreBadge
            status={project.status}
            className="absolute right-3 top-3 z-10 bg-bg-body/85 backdrop-blur-sm"
          />
        </div>
      ) : (
        <div className="relative flex h-44 items-center justify-center overflow-hidden border-b border-border-subtle bg-bg-surface">
          <div aria-hidden="true" className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-accent-ghost" />
          <div aria-hidden="true" className="absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-accent-ghost" />
          <div
            aria-hidden="true"
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-accent/40 bg-accent-ghost font-display text-xl font-bold text-accent transition-transform duration-300 group-hover:scale-105"
          >
            {initialsOf(project.title)}
          </div>
          <ScoreBadge
            status={project.status}
            label={project.statusLabel}
            className="absolute right-3 top-3 z-10"
          />
        </div>
      )}

      {/* ── Contenido ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-snug text-text-primary transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          <Badge className={cn('shrink-0 !text-[10px] font-bold', category.className)}>
            {category.label}
          </Badge>
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary">
          {project.description}
        </p>

        <TagList tags={project.tags} className="mb-4" />

        {upcoming ? (
          <div className="flex items-center gap-2 border-t border-border-subtle pt-4 text-xs text-text-muted">
            <FooterIcon size={12} className="shrink-0 text-pos-playoff" aria-hidden="true" />
            <span>{isComingSoon ? 'Disponible próximamente' : 'En desarrollo activo'}</span>
          </div>
        ) : (
          <div className="flex gap-5 border-t border-border-subtle pt-4">
            {isRealUrl(project.demoUrl) && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver demo de ${project.title} (se abre en una pestaña nueva)`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent underline-offset-4 hover:underline"
              >
                <ExternalLink size={14} aria-hidden="true" />
                Ver demo
              </a>
            )}
            {isRealUrl(project.codeUrl) && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver código de ${project.title} (se abre en una pestaña nueva)`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary underline-offset-4 transition-colors hover:text-text-primary hover:underline"
              >
                <GitHubIcon className="h-3.5 w-3.5" />
                Código
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}