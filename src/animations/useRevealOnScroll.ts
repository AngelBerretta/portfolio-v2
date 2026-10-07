'use client';

import { useLayoutEffect, useRef } from 'react';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface RevealOnScrollOptions {
  target?: string;
  direction?: RevealDirection;
  distance?: number;
  duration?: number; // segundos
  delay?: number;    // segundos
  stagger?: number;  // segundos
  rootMargin?: string;
  dependencies?: unknown[];
}

const DEFAULT_DISTANCE: Record<RevealDirection, number> = {
  up: 30, down: 30, left: 40, right: 40, none: 0,
};

function offsetFor(direction: RevealDirection, d: number): [number, number] {
  switch (direction) {
    case 'up': return [0, d];
    case 'down': return [0, -d];
    case 'left': return [-d, 0];
    case 'right': return [d, 0];
    default: return [0, 0];
  }
}

export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>({
  target,
  direction = 'up',
  distance,
  duration = 0.6,
  delay = 0,
  stagger = 0.1,
  rootMargin = '0px 0px -80px 0px', // equivale al viejo "top bottom-=80"
  dependencies = [],
}: RevealOnScrollOptions = {}) {
  const scope = useRef<T>(null);

  useLayoutEffect(() => {
    const container = scope.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = target
      ? Array.from(container.querySelectorAll<HTMLElement>(target))
      : [container];
    if (targets.length === 0) return;

    const [x, y] = offsetFor(direction, distance ?? DEFAULT_DISTANCE[direction]);
    const animations: Animation[] = [];

    for (const el of targets) el.style.opacity = '0';

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect(); // una sola vez
        targets.forEach((el, i) => {
          el.style.opacity = '';
          animations.push(
            el.animate(
              [
                { opacity: 0, transform: `translate3d(${x}px, ${y}px, 0)` },
                { opacity: 1, transform: 'none' },
              ],
              {
                duration: duration * 1000,
                delay: (delay + (target ? i * stagger : 0)) * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // ≈ power2.out
                fill: 'backwards', // mantiene el 0% durante el delay; al terminar no deja estilos
              }
            )
          );
        });
      },
      { rootMargin }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      animations.forEach((a) => a.cancel());
      for (const el of targets) el.style.opacity = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, direction, distance, duration, delay, stagger, rootMargin, ...dependencies]);

  return scope;
}