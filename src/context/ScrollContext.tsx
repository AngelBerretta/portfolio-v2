"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useSectionSpy } from '@/hooks/useSectionSpy';
import type { SectionId } from '@/lib/sections';

export interface ScrollContextValue {
  isScrolled: boolean;
  showBackToTop: boolean;
  isSideNavVisible: boolean;
  /** Sección visible según el scroll spy (solo significativa en el home). */
  activeSection: SectionId;  
}

type ScrollFlags = Omit<ScrollContextValue, 'activeSection'>;

const defaultFlags: ScrollFlags = {
  isScrolled: false,
  showBackToTop: false,
  isSideNavVisible: false,
};

const ScrollContext = createContext<ScrollContextValue>({
  ...defaultFlags,
  activeSection: 'hero',
});

/**
 * Antes, Navbar, SideNav, BackToTop y ScrollProgress instanciaban cada uno
 * su propio `useScrollState()`: 4 listeners de "scroll" + 4 rAF + 4 setState
 * corriendo en paralelo en cada frame de scroll, todos calculando exactamente
 * los mismos valores.
 *
 * ScrollProvider centraliza eso en un único listener + un único rAF para
 * toda la página guardando únicamente los booleanos, evitando re-renderizar
 * toda la app 60 veces por segundo durante el scroll.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScrollFlags>(defaultFlags);
  const activeSection = useSectionSpy();
  const value = useMemo<ScrollContextValue>(
    () => ({ ...state, activeSection }),
    [state, activeSection]
  );

  const rafRef = useRef<number | null>(null);
  const latestScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      latestScrollY.current = window.scrollY;

      // Si ya hay un frame pendiente, no agendamos otro
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        const scrollY = latestScrollY.current;

        const next = {
          isScrolled: scrollY > 40,        // mismo umbral que Navbar
          showBackToTop: scrollY > 500,    // mismo umbral que BackToTop
          isSideNavVisible: scrollY > 200, // mismo umbral que SideNav
        };

        // Solo hace el render si alguno de los booleanos cambió realmente
        setState((prev) =>
          prev.isScrolled === next.isScrolled &&
          prev.showBackToTop === next.showBackToTop &&
          prev.isSideNavVisible === next.isSideNavVisible
            ? prev
            : next
        );

        rafRef.current = null;
      });
    };

    // Ejecutamos una vez al montar para el estado inicial
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScrollContext = () => useContext(ScrollContext);