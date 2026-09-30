"use client";

import { Shirt } from "lucide-react";
import { useKit } from "@/context/KitContext";
import { cn } from "@/utils/cn";

interface KitToggleProps {
  className?: string;
}

export function KitToggle({ className }: KitToggleProps) {
  const { kit, toggleKit } = useKit();

  return (
    <button
      type="button"
      onClick={toggleKit}
      aria-label={`Cambiar a kit ${kit === "home" ? "away" : "home"}`}
      title={`Kit actual: ${kit === "home" ? "Local" : "Visitante"}`}
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
      <Shirt className="h-4 w-4" />
      <span className="hidden sm:inline">
        {kit === "home" ? "Local" : "Visitante"}
      </span>
    </button>
  );
}