import { getSkillsByCategory } from '@/actions/skills';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { PositionGroup } from './PositionGroup';
import type { PositionGroupData, SkillCategoryId } from './types';

// Metadata visual y de copy por categoría. No vive en la DB: el `id` debe
// coincidir con Skill.category (ver SKILL_CATEGORIES en lib/constants.ts).
// Los colores salen de los tokens pos-* de globals.css, así que cambian solos
// con el kit home / away. Las clases van escritas enteras para que Tailwind
// las genere.
const POSITIONS: Record<SkillCategoryId, Omit<PositionGroupData, 'id' | 'skills'>> = {
  frontend: {
    title: 'Frontend',
    position: 'Delanteros',
    code: 'DEL',
    hint: 'Lo que ve y toca el usuario: interfaces, animaciones y experiencia.',
    style: {
      badge: 'border-pos-continental/30 bg-pos-continental/10 text-pos-continental',
      code: 'bg-pos-continental text-text-inverse',
    },
  },
  backend: {
    title: 'Backend',
    position: 'Defensa',
    code: 'DEF',
    hint: 'Lo que sostiene todo por detrás: servidores, APIs y bases de datos.',
    style: {
      badge: 'border-pos-champions/30 bg-pos-champions/10 text-pos-champions',
      code: 'bg-pos-champions text-text-inverse',
    },
  },
  tools: {
    title: 'Herramientas',
    position: 'Mediocampo',
    code: 'MED',
    hint: 'Lo que conecta al equipo: control de versiones, diseño y despliegue.',
    style: {
      badge: 'border-pos-champions-playoff/30 bg-pos-champions-playoff/10 text-pos-champions-playoff',
      code: 'bg-pos-champions-playoff text-text-inverse',
    },
  },
};

const ORDER: SkillCategoryId[] = ['frontend', 'backend', 'tools'];

/**
 * Sección de tecnologías ("Plantel" en el menú). Server component async:
 * quien la use debe envolverla en <Suspense fallback={<SquadSkeleton />}>
 * (cacheComponents), igual que MatchesSection.
 *
 * Usa id="skills" porque es el que espera el scroll spy y nav-items.ts.
 */
export async function SquadSection() {
  const grouped = await getSkillsByCategory();

  const groups: PositionGroupData[] = ORDER.filter((id) => grouped[id]?.length > 0).map((id) => ({
    id,
    ...POSITIONS[id],
    // getSkillsByCategory pasa por unstable_cache (JSON), así que acá armamos
    // objetos planos con solo lo que el cliente necesita.
    skills: grouped[id].map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description ?? '',
      level: s.level,
      iconUrl: s.iconUrl,
      iconName: s.iconName,
      invertIcon: s.invertIcon,
    })),
  }));

  return (
    <section
      id="skills"
      aria-labelledby="squad-heading"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-accent-ghost blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="squad-heading"
          eyebrow="02 · Plantel"
          title="Las tecnologías que uso"
          description="Agrupadas por el rol que cumplen en un proyecto. Tocá una para ver en qué la uso."
        />

        {groups.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {groups.map((group) => (
              <PositionGroup key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-text-secondary">
            Todavía no hay tecnologías cargadas. Se agregan desde el panel de administración.
          </p>
        )}
      </div>
    </section>
  );
}
