// src/components/shared/Card.tsx
import { cn } from "@/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}

export function Card({ children, className, elevated }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border",
        elevated ? "bg-bg-elevated" : "bg-bg-card",
        "p-6",
        "transition-colors duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}