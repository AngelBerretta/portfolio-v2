import { getSkillsByCategory } from '@/actions/skills';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Glow } from '@/components/shared/Glow';
import { SquadPitch } from './SquadPitch';
import type { SquadSkill } from './types';

interface RawSkill {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  iconName: string | null;
  invertIcon: boolean;
}

// getSkillsByCategory pasa por unstable_cache (JSON), así que acá armamos
// objetos planos con solo lo que el cliente necesita.
const toSquadSkills = (list: RawSkill[] | undefined): SquadSkill[] =>
  (list ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description ?? '',
    iconUrl: s.iconUrl,
    iconName: s.iconName,
    invertIcon: s.invertIcon,
  }));

/**
 * Sección de tecnologías ("Plantel" en el menú): cancha con Frontend vs
 * Backend y un banco con las herramientas y las tecnologías de reserva.
 * Server component async: quien la use debe envolverla en
 * <Suspense fallback={<SquadSkeleton />}> (cacheComponents).
 *
 * Usa id="skills" porque es el que espera el scroll spy y nav-items.ts.
 *
 * OJO: `overflow-clip` y no `overflow-hidden`. hidden convierte a la sección
 * en un contenedor de scroll y rompe el `sticky` de la ficha en mobile.
 */
export async function SquadSection() {
  const grouped = await getSkillsByCategory();

  const frontend = toSquadSkills(grouped.frontend);
  const backend = toSquadSkills(grouped.backend);
  const tools = toSquadSkills(grouped.tools);
  const hasSkills = frontend.length + backend.length + tools.length > 0;

  return (
    <section
      id="skills"
      aria-labelledby="squad-heading"
      className="relative overflow-clip py-24 md:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Glow className="absolute left-1/4 top-0 h-[28rem] w-[28rem] -translate-x-16 -translate-y-16" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="squad-heading"
          eyebrow="02 · Plantel"
          title="Las tecnologías que uso"
          description="Frontend contra Backend en la cancha y las herramientas en el banco. Tocá un jugador para ver en qué lo uso."
        />

        {hasSkills ? (
          <SquadPitch frontend={frontend} backend={backend} tools={tools} />
        ) : (
          <p className="text-center text-sm text-text-secondary">
            Todavía no hay tecnologías cargadas. Se agregan desde el panel de administración.
          </p>
        )}
      </div>
    </section>
  );
}