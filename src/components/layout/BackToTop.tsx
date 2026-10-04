'use client';

import { ArrowUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useScrollState } from '@/hooks/useScrollState';

export function BackToTop() {
  const { showBackToTop } = useScrollState();

  return (
    <button
      type="button"
      // Sin `behavior` explícito: respeta el scroll-behavior de globals.css,
      // que ya es "smooth" solo cuando no hay prefers-reduced-motion.
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="Volver arriba"
      inert={!showBackToTop}
      className={cn(
        'fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 sm:right-6 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))]',
        'inline-flex h-11 w-11 items-center justify-center rounded-full',
        'border border-border bg-bg-card text-text-primary',
        'transition-all duration-300 hover:border-accent hover:text-accent',
        showBackToTop
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}