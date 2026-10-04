'use client';

import { useTypewriter } from '@/hooks/useTypewriter';

/** Isla cliente mínima: el resto del hero se renderiza en el servidor. */
export function TypedRole({ roles }: { roles: readonly string[] }) {
  const text = useTypewriter(roles);

  return (
    <p className="flex h-10 items-center justify-center md:h-12 lg:justify-start">
      {/* Texto estable para lectores de pantalla y SEO; el animado se oculta. */}
      <span className="sr-only">{roles.join(', ')}</span>
      <span
        aria-hidden="true"
        className="font-mono text-xl font-semibold text-accent md:text-3xl"
      >
        {text}
        <span className="ml-0.5 motion-safe:animate-pulse">|</span>
      </span>
    </p>
  );
}