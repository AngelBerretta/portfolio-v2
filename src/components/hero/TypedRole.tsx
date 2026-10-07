'use client';

import { useEffect, useRef, useState } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';

export function TypedRole({ roles }: { roles: readonly string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const text = useTypewriter(roles, 80, 2000, !visible);

  return (
    <p ref={ref} className="flex h-10 items-center justify-center md:h-12 lg:justify-start">
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