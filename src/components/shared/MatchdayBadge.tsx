import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/**
 * Etiqueta neutra estilo planilla de partido: un código corto decorativo
 * (aria-hidden) + el texto que carga el significado. Mismo patrón visual que
 * ScoreBadge y PositionGroup, pero sin estado asociado: sirve para cualquier
 * rótulo suelto ("FIN · Gracias por visitar", "MD · Temporada 2026").
 */
export function MatchdayBadge({
  code = 'MD',
  title,
  children,
  className,
}: {
  /** Código decorativo, 2–4 letras. */
  code?: string;
  /** Tooltip con el significado en lenguaje llano. */
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex items-stretch overflow-hidden rounded-md border border-border bg-bg-elevated font-mono text-[11px] font-semibold text-text-secondary',
        className
      )}
    >
      <span aria-hidden="true" className="bg-text-muted px-1.5 py-0.5 tracking-wider text-text-inverse">
        {code}
      </span>
      <span className="px-2 py-0.5">{children}</span>
    </span>
  );
}
