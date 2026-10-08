import { cn } from '@/utils/cn';

/**
 * Resplandor decorativo. Reemplaza `rounded-full bg-accent-ghost blur-3xl`:
 * un radial-gradient se ve casi igual pero no obliga a la GPU a calcular un
 * filtro de blur sobre un div enorme. Los colores salen del token, así que
 * sigue cambiando solo con el kit home / away.
 */
export function Glow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(className)}
      style={{
        background:
          'radial-gradient(closest-side, var(--color-accent-ghost) 35%, transparent)',
      }}
    />
  );
}