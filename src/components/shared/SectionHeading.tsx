import { cn } from '@/utils/cn';
import { Reveal } from './Reveal';

/** Encabezado común a todas las secciones públicas (Partidos, Plantel, etc.). */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  /** id del <h2>, para enlazarlo con aria-labelledby de la <section> */
  id?: string;
  /** Línea pequeña sobre el título, ej: "03 · Partidos" */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        'mb-12 flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && <p className="font-mono text-sm font-medium text-accent">{eyebrow}</p>}
      <h2 id={id} className="font-display text-4xl font-bold md:text-5xl">
        {title}
      </h2>
      {description && <p className="max-w-xl text-base text-text-secondary">{description}</p>}
      <div aria-hidden="true" className="mt-2 h-1 w-16 rounded-full bg-accent" />
    </Reveal>
  );
}