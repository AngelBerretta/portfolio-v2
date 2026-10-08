'use client';

import { useEffect, useState } from 'react';
import { SECTIONS, type SectionId } from '@/lib/sections';
import { useSitePathname } from './useSitePathname';

// Banda de detección: desde 100px bajo el borde superior (el navbar) hasta el
// 40% de la altura del viewport. La sección que cruza esa banda es la activa;
// si cruzan dos (en el límite), gana la de más abajo.
// OJO: 100px + el % de abajo tienen que dejar una banda con altura positiva.
// Con -60% hace falta un viewport de más de ~250px. Si pasás a -80% o más,
// en un teléfono en horizontal la banda queda vacía y el spy deja de andar.
const BAND = '-100px 0px -60% 0px';

/**
 * Scroll spy sin listeners de scroll ni lecturas de layout: dos
 * IntersectionObserver (la banda y el footer). Pensado para instanciarse UNA
 * vez, en ScrollProvider.
 *
 * - Las secciones del home llegan por streaming (Suspense), y la del hero se
 *   reemplaza cuando terminan los datos. Por eso un MutationObserver sobre
 *   <main> re-escanea los ids y observa lo que va apareciendo.
 * - "Llegó al final → contact": se resuelve observando el footer, en vez de
 *   leer scrollHeight en cada frame.
 * - Solo corre en "/". En otras rutas no hay observers.
 */
export function useSectionSpy(): SectionId {
  const pathname = useSitePathname();
  const [active, setActive] = useState<SectionId>('hero');

  useEffect(() => {
    if (pathname !== '/') return;

    // Se guardan elementos (no ids) para que el nodo viejo del hero, al
    // reemplazarse, no pise el estado del nuevo.
    const inBand = new Set<Element>();
    const watched = new Map<SectionId, Element>();
    let footerVisible = false;

    const publish = () => {
      if (footerVisible) {
        setActive('contact');
        return;
      }
      let best = -1;
      for (const el of inBand) best = Math.max(best, SECTIONS.indexOf(el.id as SectionId));
      // Si no cruza ninguna (hueco entre skeletons sin id), se conserva la anterior.
      if (best >= 0) setActive(SECTIONS[best]);
    };

    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target);
          else inBand.delete(e.target);
        }
        publish();
      },
      { rootMargin: BAND }
    );

    const footerObserver = new IntersectionObserver((entries) => {
      for (const e of entries) footerVisible = e.isIntersecting;
      publish();
    });

    const footer = document.querySelector('footer');
    if (footer) footerObserver.observe(footer);

    const scan = () => {
      for (const id of SECTIONS) {
        const el = document.getElementById(id) ?? undefined;
        const prev = watched.get(id);
        if (el === prev) continue;
        if (prev) {
          spy.unobserve(prev);
          inBand.delete(prev);
          watched.delete(id);
        }
        if (el) {
          spy.observe(el);
          watched.set(id, el);
        }
      }
      publish();
    };

    // La primera pasada también va por rAF: así no hay setState síncrono
    // dentro del efecto.
    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        scan();
      });
    };
    schedule();

    // Cada mutación cuesta 5 getElementById (sin layout), y va con rAF.
    const mo = new MutationObserver(schedule);
    mo.observe(document.getElementById('main-content') ?? document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      spy.disconnect();
      footerObserver.disconnect();
    };
  }, [pathname]);

  return active;
}