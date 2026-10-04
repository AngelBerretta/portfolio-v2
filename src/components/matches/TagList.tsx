'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

const MAX_TAGS_VISIBLE = 3;

/** Tags de tecnologías con "+N / menos". Sin librería de animación. */
export function TagList({ tags, className }: { tags: string[]; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const hidden = tags.length - MAX_TAGS_VISIBLE;
  const visible = expanded ? tags : tags.slice(0, MAX_TAGS_VISIBLE);

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {visible.map((tag) => (
        <li
          key={tag}
          className="rounded-md border border-border-subtle bg-bg-surface px-2 py-0.5 text-[11px] font-medium text-text-muted"
        >
          {tag}
        </li>
      ))}

      {hidden > 0 && (
        <li>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Mostrar menos tecnologías' : `Mostrar ${hidden} tecnologías más`}
            className="rounded-md border border-accent/30 bg-accent-ghost px-2 py-0.5 text-[11px] font-bold text-accent transition-colors hover:bg-accent/20"
          >
            {expanded ? (
              <span className="flex items-center gap-0.5">
                <ChevronDown size={10} className="rotate-180" aria-hidden="true" /> menos
              </span>
            ) : (
              `+${hidden}`
            )}
          </button>
        </li>
      )}
    </ul>
  );
}