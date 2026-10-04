'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useStatBarFill } from '@/animations/useStatBarFill';
import { SkillIcon } from './SkillIcon';
import type { SquadSkill } from './types';

/**
 * Una fila de skill: ícono, nombre, nivel y barra.
 *
 * - La barra y el número se animan al entrar en viewport (useStatBarFill).
 *   El `width` inline ya es el valor final, así que con reduced-motion o sin
 *   JS la barra se ve correcta y simplemente no se anima.
 * - Si la skill tiene descripción, la fila es un botón que la despliega.
 *   Es la única interacción de la sección: así las tarjetas se mantienen
 *   compactas y la descripción sigue en el DOM (SEO, lectores de pantalla).
 */
export function SkillStatBar({ skill, index }: { skill: SquadSkill; index: number }) {
  const level = Math.round(Math.min(100, Math.max(0, skill.level)));

  // El delay por índice solo se nota cuando varias barras entran juntas;
  // lo topamos para que las de más abajo no lleguen tarde al scrollear.
  const { barRef, valueRef } = useStatBarFill(level, { delay: Math.min(index, 5) * 0.06 });

  const [open, setOpen] = useState(false);
  const panelId = useId();
  const hasDescription = skill.description.length > 0;

  const row = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-bg-surface">
        <SkillIcon skill={skill} />
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-sm font-medium">{skill.name}</span>
      <span className="font-display text-lg font-bold tabular-nums text-accent">
        <span className="sr-only">Nivel </span>
        {/* valueRef: useStatBarFill reescribe este nodo de texto al contar 0 → nivel */}
        <span ref={valueRef}>{level}</span>
      </span>
      {hasDescription && (
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 motion-reduce:transition-none',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      )}
    </>
  );

  return (
    <li>
      {hasDescription ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center gap-3 rounded-md text-left text-text-primary transition-colors hover:text-accent"
        >
          {row}
        </button>
      ) : (
        <div className="flex items-center gap-3 text-text-primary">{row}</div>
      )}

      <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-elevated">
        <div
          ref={barRef}
          className="h-full rounded-full bg-accent"
          style={{ width: `${level}%` }}
        />
      </div>

      {hasDescription && (
        // grid-rows 0fr → 1fr anima la altura sin medirla ni usar una librería.
        // `inert` saca del tab order y de los lectores de pantalla el texto
        // mientras está colapsado.
        <div
          id={panelId}
          inert={!open}
          className={cn(
            'grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none',
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <p className="pt-2 text-xs leading-relaxed text-text-secondary">{skill.description}</p>
          </div>
        </div>
      )}
    </li>
  );
}
