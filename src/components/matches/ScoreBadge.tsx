import { cn } from '@/utils/cn';
import type { ProjectStatus } from './types';

// Estilo marcador de partido: un código corto (decorativo) + la etiqueta en
// lenguaje llano. El significado SIEMPRE está en el texto y en el title, nunca
// solo en la jerga futbolera, para que un reclutador lo entienda de un vistazo.
const STATES = {
  live: {
    code: 'FIN',
    label: 'Online',
    title: 'Proyecto terminado y publicado',
    box: 'border-win/30 bg-win/10 text-win',
    codeBox: 'bg-win text-text-inverse',
  },
  'in-progress': {
    code: '1T',
    label: 'En construcción',
    title: 'Proyecto en desarrollo',
    box: 'border-pos-playoff/30 bg-pos-playoff/10 text-pos-playoff',
    codeBox: 'bg-pos-playoff text-text-inverse',
  },
  'coming-soon': {
    code: 'PRE',
    label: 'Próximamente',
    title: 'Proyecto próximo a comenzar',
    box: 'border-border bg-bg-elevated text-text-secondary',
    codeBox: 'bg-text-muted text-text-inverse',
  },
} as const;

export function ScoreBadge({
  status = 'live',
  label,
  className,
}: {
  status?: ProjectStatus;
  /** Etiqueta personalizada (Project.statusLabel). Se ignora para 'live'. */
  label?: string;
  className?: string;
}) {
  const state = STATES[status];
  const text = status === 'live' ? state.label : (label ?? state.label);

  return (
    <span
      title={state.title}
      className={cn(
        'inline-flex items-stretch overflow-hidden rounded-md border font-mono text-[11px] font-semibold',
        state.box,
        className
      )}
    >
      <span aria-hidden="true" className={cn('px-1.5 py-0.5 tracking-wider', state.codeBox)}>
        {state.code}
      </span>
      <span className="px-2 py-0.5">{text}</span>
    </span>
  );
}