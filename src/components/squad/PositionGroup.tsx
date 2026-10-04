import { cn } from '@/utils/cn';
import { SkillStatBar } from './SkillStatBar';
import type { PositionGroupData } from './types';

/**
 * Tarjeta de un grupo de skills. Server component: solo las filas
 * (SkillStatBar) son islas cliente.
 *
 * Jerarquía a propósito: el título en lenguaje llano ("Frontend") es lo
 * primero que se lee; la posición ("Delanteros") es una etiqueta chica y la
 * línea de abajo explica el grupo sin metáfora. Mismo patrón que ScoreBadge:
 * código decorativo (aria-hidden) + texto que carga el significado.
 */
export function PositionGroup({ group }: { group: PositionGroupData }) {
  const headingId = `squad-group-${group.id}`;

  return (
    <section
      aria-labelledby={headingId}
      className="flex h-full flex-col rounded-xl border border-border bg-bg-card p-6"
    >
      <header className="mb-6">
        <span
          className={cn(
            'inline-flex items-stretch overflow-hidden rounded-md border font-mono text-[11px] font-semibold',
            group.style.badge
          )}
        >
          <span aria-hidden="true" className={cn('px-1.5 py-0.5 tracking-wider', group.style.code)}>
            {group.code}
          </span>
          <span className="px-2 py-0.5">{group.position}</span>
        </span>

        <h3 id={headingId} className="mt-3 font-display text-2xl font-bold text-text-primary">
          {group.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{group.hint}</p>
      </header>

      <ul className="space-y-5">
        {group.skills.map((skill, i) => (
          <SkillStatBar key={skill.id} skill={skill} index={i} />
        ))}
      </ul>
    </section>
  );
}
