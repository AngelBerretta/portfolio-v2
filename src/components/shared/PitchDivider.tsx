import { cn } from '@/utils/cn';

/**
 * Separador decorativo: la línea media de la cancha con el círculo central y
 * el punto de saque. CSS puro, sin JS, y los colores salen de los tokens, así
 * que cambia solo con el kit home / away. Es solo ornamento (aria-hidden).
 *
 * Pensado para usarse con moderación: separa el cierre de la página (Footer).
 * Si lo ponés entre secciones, que sea en pocos lugares.
 */
export function PitchDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex h-10 items-center', className)}>
      <div className="h-px flex-1 bg-border-subtle" />
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-subtle">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      </div>
      <div className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}
