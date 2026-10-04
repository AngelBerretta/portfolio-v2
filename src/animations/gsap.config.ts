// gsap.config.ts — ÚNICO lugar donde se registran los plugins de GSAP.
//
// Regla: todo el código de animación importa `gsap`, `ScrollTrigger` y
// `useGSAP` desde acá, nunca directo de "gsap" / "@gsap/react". Así el
// registro ocurre una sola vez y ningún hook depende del orden de imports.
//
// Este módulo solo debe importarse desde Client Components / hooks con
// 'use client'. El guard de `window` evita que el registro corra en el
// servidor si alguna vez se importa por accidente en una ruta SSR.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);

  // En mobile, la barra de direcciones que aparece/desaparece dispara
  // resizes que recalculaban todos los triggers (y hacían "saltar" las
  // animaciones). Con esto solo se refresca en cambios reales de tamaño.
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Cuando las fuentes terminan de cargar cambia la altura del texto y, con
  // ella, la posición de todo lo que está más abajo. Sin este refresh los
  // triggers quedan calculados con las medidas del fallback.
  void document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/**
 * Media query bajo la que SÍ se anima. Se usa con `gsap.matchMedia()`:
 * cuando el usuario tiene `prefers-reduced-motion: reduce`, el callback no
 * corre, los elementos quedan en su estado final y nada se mueve. Si la
 * preferencia cambia en caliente, matchMedia revierte las animaciones solo.
 */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export { gsap, ScrollTrigger, useGSAP };