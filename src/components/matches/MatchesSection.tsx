import { getAllProjects } from '@/actions/projects';
import { PROJECT_FILTER_TABS } from '@/lib/constants';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Glow } from '@/components/shared/Glow';
import { cn } from '@/utils/cn';
import { MatchList } from './MatchList';
import { mapProjectsToCardData, splitLiveUpcoming } from './mapProjects';

/**
 * Sección de proyectos. Se usa en dos lugares:
 *  - variant="home": id="projects" (lo usa el scroll spy), solo los titulares
 *    marcados como "Destacado en la home" + los suplentes, sin filtro, con
 *    link a /partidos.
 *  - variant="page": la página /partidos con todo y el filtro.
 *
 * Es async: quien la use debe envolverla en <Suspense> (cacheComponents).
 */
export async function MatchesSection({ variant = 'page' }: { variant?: 'home' | 'page' }) {
  const projects = await getAllProjects();
  const { live, upcoming } = splitLiveUpcoming(mapProjectsToCardData(projects));

  const isHome = variant === 'home';

  // Si todavía no marcaste ninguno como destacado, el home muestra los 3
  // primeros en vez de quedar vacío.
  const featured = live.filter((p) => p.featured);
  const titulares = isHome ? (featured.length > 0 ? featured : live.slice(0, 3)) : live;

  return (
    <section
      id={isHome ? 'projects' : undefined}
      aria-labelledby="matches-heading"
      className={cn('relative overflow-hidden', isHome ? 'py-24 md:py-32' : 'pb-24 pt-10')}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Glow className="absolute right-1/4 top-0 h-[28rem] w-[28rem] translate-x-16 -translate-y-16" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="matches-heading"
          eyebrow="03 · Partidos"
          title="Lo que he construido"
          description="Una selección de proyectos freelance, personales y full stack en desarrollo."
        />

        <MatchList
          titulares={titulares}
          suplentes={upcoming}
          categories={PROJECT_FILTER_TABS}
          showFilters={!isHome}
          viewAll={isHome ? { href: '/partidos', count: live.length } : undefined}
        />
      </div>
    </section>
  );
}