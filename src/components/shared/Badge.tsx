// src/components/shared/Badge.tsx
import { cn } from "@/utils/cn";

type BadgeVariant =
  | "default"
  | "live"
  | "win"
  | "loss"
  | "draw"
  | "champions"
  | "continental"
  | "playoff"
  | "relegation";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-bg-elevated text-text-secondary border-border",
  live: "bg-live-bg text-live border-live/30",
  win: "bg-win/10 text-win border-win/30",
  loss: "bg-loss/10 text-loss border-loss/30",
  draw: "bg-draw/10 text-draw border-draw/30",
  champions: "bg-pos-champions/10 text-pos-champions border-pos-champions/30",
  continental:
    "bg-pos-continental/10 text-pos-continental border-pos-continental/30",
  playoff: "bg-pos-playoff/10 text-pos-playoff border-pos-playoff/30",
  relegation:
    "bg-pos-relegation/10 text-pos-relegation border-pos-relegation/30",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "rounded-full border px-2.5 py-0.5",
        "text-xs font-medium",
        "transition-colors duration-200",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}