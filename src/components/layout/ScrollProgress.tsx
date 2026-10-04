'use client';

import { useScrollState } from '@/hooks/useScrollState';

/** Barra fina arriba de todo que muestra cuánto de la página se recorrió. */
export function ScrollProgress() {
  const { scrollProgress } = useScrollState();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5"
    >
      {/* scaleX en vez de width: no dispara layout en cada frame de scroll */}
      <div
        className="h-full origin-left bg-accent"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />
    </div>
  );
}