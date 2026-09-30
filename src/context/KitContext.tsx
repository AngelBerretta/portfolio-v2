"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
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

export function KitProvider({ children }: { children: ReactNode }) {
  // Arrancamos SIEMPRE con 'away' para que server y cliente coincidan
  const [kit, setKitState] = useState<Kit>("away");
  const [mounted, setMounted] = useState(false);

  // Después de montar, leemos el valor real del DOM
  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-kit");
    const initial: Kit = attr === "home" ? "home" : "away";
    setKitState(initial);
    setMounted(true);
  }, []);

  // Sincronizamos DOM y localStorage cuando cambia el kit (post-mount)
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute("data-kit", kit);
    try {
      localStorage.setItem("portfolio-kit", kit);
    } catch {
      // ignoramos
    }
  }, [kit, mounted]);

  const setKit = (next: Kit) => setKitState(next);
  const toggleKit = () =>
    setKitState((current) => (current === "away" ? "home" : "away"));

  return (
    <KitContext.Provider
      value={{
        kit,
        toggleKit,
        setKit,
        isHome: kit === "home",
        isAway: kit === "away",
        mounted,
      }}
    >
      {children}
    </KitContext.Provider>
  );
}

export const useKit = () => useContext(KitContext);