'use client';

import type { ReactNode } from 'react';
import { useRevealOnScroll } from '@/animations/useRevealOnScroll';

/**
 * Envuelve contenido de un Server Component para revelarlo al hacer scroll.
 * Existe porque los hooks no pueden usarse en server components: así
 * SectionHeading y las secciones siguen siendo server y solo esta cáscara
 * es cliente.
 */
export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration,
}: {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
}) {
  const ref = useRevealOnScroll<HTMLDivElement>({ direction, delay, duration });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}