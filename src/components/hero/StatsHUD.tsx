import type { CSSProperties } from 'react';
import { cn } from '@/utils/cn';
import type { HeroStat } from './hero-data';

/** Marcador tipo HUD con las cifras clave. Server component. */
export function StatsHUD({
  stats,
  delay = 0,
  className,
}: {
  stats: HeroStat[];
  /** Retraso de la animación de entrada, en segundos. */
  delay?: number;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        'hero-intro grid divide-x divide-border-subtle rounded-lg border border-border bg-bg-card/60 backdrop-blur-sm',
        className
      )}
      style={
        {
          gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
          '--hero-delay': `${delay}s`,
        } as CSSProperties
      }
    >
      {stats.map((stat) => (
        // dt (etiqueta) va primero en el DOM por semántica; flex-col-reverse
        // muestra la cifra arriba.
        <div
          key={stat.label}
          className="flex flex-col-reverse items-center gap-1 px-2 py-4 sm:py-5"
        >
          <dt className="text-xs font-medium text-text-muted sm:text-sm">{stat.label}</dt>
          <dd className="font-display text-3xl font-bold text-accent md:text-4xl">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}