"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Kit = "home" | "away";

interface KitContextValue {
  kit: Kit;
  toggleKit: () => void;
  setKit: (kit: Kit) => void;
  isHome: boolean;
  isAway: boolean;
  /** true después de hidratar — usar para evitar mismatches SSR */
  mounted: boolean;
}

const KitContext = createContext<KitContextValue>({
  kit: "away",
  toggleKit: () => {},
  setKit: () => {},
  isHome: false,
  isAway: true,
  mounted: false,
});

// La fuente de verdad del kit es el atributo data-kit de <html>. Lo deja
// puesto el script anti-flash del layout ANTES de hidratar, y acá solo lo
// leemos / escribimos. useSyncExternalStore existe justo para esto: leer un
// valor externo sin el patrón "useEffect + setState" (que dispara un render
// extra y el lint de React marca como error).

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-kit"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Kit {
  return document.documentElement.getAttribute("data-kit") === "home" ? "home" : "away";
}

// Servidor y primer render de hidratación: SIEMPRE 'away', así server y
// cliente coinciden; React corrige solo después si el kit real es 'home'.
function getServerSnapshot(): Kit {
  return "away";
}

const subscribeNoop = () => () => {};

export function KitProvider({ children }: { children: ReactNode }) {
  const kit = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // false en servidor / hidratación, true una vez en el cliente.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  const setKit = useCallback((next: Kit) => {
    document.documentElement.setAttribute("data-kit", next);
    try {
      localStorage.setItem("portfolio-kit", next);
    } catch {
      // ignoramos
    }
  }, []);

  const toggleKit = useCallback(() => {
    setKit(getSnapshot() === "away" ? "home" : "away");
  }, [setKit]);

  const value = useMemo<KitContextValue>(
    () => ({
      kit,
      toggleKit,
      setKit,
      isHome: kit === "home",
      isAway: kit === "away",
      mounted,
    }),
    [kit, toggleKit, setKit, mounted]
  );

  return <KitContext.Provider value={value}>{children}</KitContext.Provider>;
}

export const useKit = () => useContext(KitContext);