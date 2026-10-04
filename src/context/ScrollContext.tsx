"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface ScrollContextValue {
  scrollY: number;
  scrollProgress: number;
  isScrolled: boolean;
  showBackToTop: boolean;
  isSideNavVisible: boolean;
}

const defaultValue: ScrollContextValue = {
  scrollY: 0,
  scrollProgress: 0,
  isScrolled: false,
  showBackToTop: false,
  isSideNavVisible: false,
};

const ScrollContext = createContext<ScrollContextValue>(defaultValue);

/**
 * Antes, Navbar, SideNav, BackToTop y ScrollProgress instanciaban cada uno
 * su propio `useScrollState()`: 4 listeners de "scroll" + 4 rAF + 4 setState
 * corriendo en paralelo en cada frame de scroll, todos calculando exactamente
 * los mismos valores.
 *
 * ScrollProvider centraliza eso en un único listener + un único rAF para
 * toda la página. Los componentes consumen el resultado ya calculado vía
 * useScrollContext() (o el wrapper useScrollState(), que se mantiene por
 * compatibilidad) sin agregar trabajo extra al scroll.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScrollContextValue>(defaultValue);

  const rafRef = useRef<number | null>(null);
  const latestScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      latestScrollY.current = window.scrollY;

      // Si ya hay un frame pendiente, no agendamos otro
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        const scrollY = latestScrollY.current;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress =
          docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;

        setState({
          scrollY,
          scrollProgress,
          isScrolled: scrollY > 40,        // mismo umbral que Navbar
          showBackToTop: scrollY > 500,    // mismo umbral que BackToTop
          isSideNavVisible: scrollY > 200, // mismo umbral que SideNav
        });

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
    <ScrollContext.Provider value={state}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScrollContext = () => useContext(ScrollContext);