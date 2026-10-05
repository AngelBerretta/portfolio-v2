'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SkillIcon } from './SkillIcon';
import type { SquadSkill } from './types';

/**
 * Una fila de tecnología: ícono y nombre. Si tiene descripción, la fila es un
 * botón que la despliega: es la única interacción de la sección, así las
 * tarjetas se mantienen compactas y la descripción sigue en el DOM (SEO,
 * lectores de pantalla).
 */
export function SkillRow({ skill }: { skill: SquadSkill }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const hasDescription = skill.description.length > 0;

  const row = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-bg-surface">
        <SkillIcon skill={skill} />
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-sm font-medium">{skill.name}</span>
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
    <li className="py-3 first:pt-0 last:pb-0">
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