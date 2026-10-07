'use client';

import {
  Briefcase,
  Code2,
  Download,
  GraduationCap,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import { useRevealOnScroll } from '@/animations/useRevealOnScroll';

export interface AboutFacts {
  location: string;
  education: string;
  experience: string;
  currentFocus: string;
}

const FACTS: { key: keyof AboutFacts; label: string; icon: LucideIcon }[] = [
  { key: 'location', label: 'Ubicación', icon: MapPin },
  { key: 'education', label: 'Educación', icon: GraduationCap },
  { key: 'experience', label: 'Experiencia', icon: Briefcase },
  { key: 'currentFocus', label: 'Foco actual', icon: Code2 },
];

const primaryLink =
  'inline-flex h-12 items-center justify-center gap-2 rounded-md border border-transparent bg-accent px-6 text-base font-medium text-text-inverse transition-all duration-200 hover:bg-accent-dim';

/**
 * Columna de texto de "Sobre mí". Es cliente solo por el hook de animación
 * (los iconos se resuelven acá adentro porque un componente no puede viajar
 * como prop de servidor a cliente). Una única revelación con stagger:
 * bio → tarjetas → botón de CV.
 */
export function AboutContent({
  bio,
  facts,
  cvUrl,
}: {
  bio: string;
  facts: AboutFacts;
  cvUrl: string | null;
}) {
  const ref = useRevealOnScroll<HTMLDivElement>({
    target: '[data-reveal]',
    distance: 20,
    stagger: 0.08,
  });

  const paragraphs = bio
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div ref={ref} className="space-y-8">
      <div
        data-reveal
        className="max-w-prose space-y-4 text-base leading-relaxed text-text-secondary md:text-lg"
      >
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        {FACTS.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            data-reveal
            className="rounded-lg border border-border-subtle bg-bg-card p-4"
          >
            <dt className="flex items-center gap-3 text-xs font-medium text-text-muted">
              <Icon className="h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
              {label}
            </dt>
            <dd className="mt-1 pl-[30px] text-sm font-medium leading-snug text-text-primary">
              {facts[key]}
            </dd>
          </div>
        ))}
      </dl>

      {cvUrl && (
        <div data-reveal>
          <a href={cvUrl} target="_blank" rel="noopener noreferrer" download className={primaryLink}>
            <Download size={16} aria-hidden="true" />
            Descargar CV
          </a>
        </div>
      )}
    </div>
  );
}
