'use client';

import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from './gsap.config';

export interface StatBarFillOptions {
  duration?: number;
  /** Útil para escalonar barras de una misma lista: index * 0.08 */
  delay?: number;
  start?: string;
}

/**
 * Anima el relleno de una barra de skill (0 → su nivel) al entrar en viewport,
 * y opcionalmente cuenta el número de 0 → nivel en sincronía.
 *
 * El markup define el estado FINAL con un `width` estático; GSAP solo anima
 * `scaleX` de 0 a 1. Así, con `prefers-reduced-motion` (o sin JS) la barra
 * ya se ve con el valor correcto y simplemente no se anima.
 *
 * @example
 *   const { barRef, valueRef } = useStatBarFill(skill.level, { delay: i * 0.08 });
 *   <span><span ref={valueRef}>{skill.level}</span>%</span>
 *   <div className="h-1.5 overflow-hidden rounded-full bg-bg-elevated">
 *     <div
 *       ref={barRef}
 *       className="h-full rounded-full bg-accent"
 *       style={{ width: `${skill.level}%` }}
 *     />
 *   </div>
 *
 * `valueRef` es opcional: si no lo conectás a ningún elemento, solo anima la barra.
 * El contenedor de la barra debería llevar `overflow-hidden` para que los
 * extremos redondeados no se deformen durante el scaleX.
 */
export function useStatBarFill<
  TBar extends HTMLElement = HTMLDivElement,
  TValue extends HTMLElement = HTMLSpanElement,
>(level: number, { duration = 1.1, delay = 0, start = 'top bottom-=40' }: StatBarFillOptions = {}) {
  const barRef = useRef<TBar>(null);
  const valueRef = useRef<TValue>(null);

  useGSAP(
    () => {
      const bar = barRef.current;
      if (!bar) return;

      const target = Math.round(Math.min(100, Math.max(0, level)));
      const valueEl = valueRef.current;

      // Escribimos en el nodo de texto existente (no con textContent) para no
      // dejar a React con una referencia a un nodo desmontado.
      const setValue = (n: number) => {
        if (!valueEl) return;
        if (valueEl.firstChild) valueEl.firstChild.nodeValue = String(n);
        else valueEl.textContent = String(n);
      };

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          delay,
          scrollTrigger: { trigger: bar, start, once: true },
        });

        tl.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: 'left center',
            duration,
            ease: 'power3.out',
            clearProps: 'transform',
          },
          0
        );

        if (valueEl) {
          const counter = { n: 0 };
          setValue(0); // coherente con la barra vacía mientras espera el scroll
          tl.to(
            counter,
            {
              n: target,
              duration,
              ease: 'power3.out',
              onUpdate: () => setValue(Math.round(counter.n)),
            },
            0
          );
        }

        // Al revertir (desmontaje, cambio de level, o el usuario activa
        // reduced-motion) el texto vuelve al valor real.
        return () => setValue(target);
      });

      return () => mm.revert();
    },
    { dependencies: [level, duration, delay, start], revertOnUpdate: true }
  );

  return { barRef, valueRef };
}