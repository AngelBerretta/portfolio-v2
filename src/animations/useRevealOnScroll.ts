'use client';

import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from './gsap.config';

/** Mismo significado que en el viejo useReveal: es de dónde VIENE el elemento. */
type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface RevealOnScrollOptions {
  /** Selector CSS (dentro del contenedor) de los hijos a revelar, ej:
   *  '[data-reveal]'. Si se omite, se revela el contenedor mismo. */
  target?: string;
  direction?: RevealDirection;
  /** Distancia en px del desplazamiento inicial. Default: 30 vertical, 40 horizontal. */
  distance?: number;
  duration?: number;
  delay?: number;
  /** Segundos entre hijo e hijo. Solo aplica cuando hay `target`. */
  stagger?: number;
  /** Sintaxis de ScrollTrigger. Default equivale al viejo rootMargin de -80px. */
  start?: string;
  /** Si el contenido revelado cambia (ej: filtro de proyectos), pasá acá lo
   *  que lo determina para que se vuelva a armar la animación. */
  dependencies?: unknown[];
}

const DEFAULT_DISTANCE: Record<RevealDirection, number> = {
  up: 30,
  down: 30,
  left: 40,
  right: 40,
  none: 0,
};

function offsetFor(direction: RevealDirection, distance: number) {
  switch (direction) {
    case 'up':
      return { y: distance };
    case 'down':
      return { y: -distance };
    case 'left':
      return { x: -distance };
    case 'right':
      return { x: distance };
    default:
      return {};
  }
}

/**
 * Revela un elemento (o varios hijos, con stagger) al entrar en viewport.
 * Dispara una sola vez. Reemplaza a `useReveal` (IntersectionObserver + CSS).
 *
 * @example Un bloque
 *   const ref = useRevealOnScroll({ direction: 'left' });
 *   return <div ref={ref}>...</div>;
 *
 * @example Varios hijos con stagger
 *   const ref = useRevealOnScroll({ target: '[data-reveal]', stagger: 0.1 });
 *   return (
 *     <ul ref={ref}>
 *       {items.map((i) => <li key={i.id} data-reveal>...</li>)}
 *     </ul>
 *   );
 *
 * Limpieza: useGSAP revierte todo (tweens, ScrollTriggers, estilos inline)
 * al desmontar, así que no quedan triggers huérfanos al navegar.
 *
 * Ojo: pensado para contenido que arranca FUERA de pantalla. Lo que ya se
 * ve al cargar (el hero) debería tener su propia timeline de entrada.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>({
  target,
  direction = 'up',
  distance,
  duration = 0.6,
  delay = 0,
  stagger = 0.1,
  start = 'top bottom-=80',
  dependencies = [],
}: RevealOnScrollOptions = {}) {
  const scope = useRef<T>(null);

  useGSAP(
    () => {
      const container = scope.current;
      if (!container) return;

      const targets = target
        ? gsap.utils.toArray<HTMLElement>(target, container)
        : [container];
      if (targets.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.from(targets, {
          opacity: 0,
          ...offsetFor(direction, distance ?? DEFAULT_DISTANCE[direction]),
          duration,
          delay,
          ease: 'power2.out',
          stagger: target ? stagger : 0,
          // Al terminar, GSAP limpia sus estilos inline: no quedan
          // `transform`/`opacity` pisando hovers ni creando stacking contexts.
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: container, start, once: true },
        });
      });

      return () => mm.revert();
    },
    { scope, dependencies, revertOnUpdate: true }
  );

  return scope;
}