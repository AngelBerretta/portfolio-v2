"use client";

import { Shirt } from "lucide-react";
import { useKit } from "@/context/KitContext";
import { cn } from "@/utils/cn";

interface KitToggleProps {
  className?: string;
}

const KIT_LABEL = { home: "Local", away: "Visitante" } as const;

export function KitToggle({ className }: KitToggleProps) {
  const { kit, toggleKit } = useKit();
  const next = kit === "home" ? "away" : "home";

  return (
    <button
      type="button"
      onClick={toggleKit}
      // WCAG 2.5.3 (Label in Name): el texto visible es el kit ACTUAL
      // ("Local" / "Visitante"), así que el nombre accesible tiene que
      // empezar por esa misma palabra. Si no, quien usa control por voz dice
      // "clic en Local" y no pasa nada.
      aria-label={`${KIT_LABEL[kit]}. Cambiar al kit ${KIT_LABEL[next].toLowerCase()}`}
      title={`Kit actual: ${KIT_LABEL[kit]}`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full",
        "h-10 px-4 text-sm font-medium",
        "bg-bg-card text-text-primary",
        "border border-border",
        "transition-all duration-200",
        "hover:border-accent hover:text-accent",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
        className
      )}
    >
      <Shirt className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">{KIT_LABEL[kit]}</span>
    </button>
  );
}