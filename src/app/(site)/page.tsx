import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllProjects } from '@/actions/projects';
import { getAllSkills } from '@/actions/skills';
import { HeroSection } from '@/components/hero/HeroSection';
import { HERO_STATS, SOCIAL_LINKS } from '@/components/hero/hero-data';
import { AboutSection } from '@/components/about/AboutSection';
import { AboutSkeleton } from '@/components/about/AboutSkeleton';
import { SquadSection } from '@/components/squad/SquadSection';
import { SquadSkeleton } from '@/components/squad/SquadSkeleton';
import { MatchesSection } from '@/components/matches/MatchesSection';
import { MatchesSkeleton } from '@/components/matches/MatchesSkeleton';
import { mapProjectsToCardData, splitLiveUpcoming } from '@/components/matches/mapProjects';
import { TransferSection } from '@/components/transfer/TransferSection';
import { SITE_NAME, SITE_URL } from '@/lib/site';

// Título, descripción y Open Graph los hereda del layout raíz.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// Datos estructurados para buscadores (schema.org/Person).
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_NAME,
  jobTitle: 'Full Stack Developer',
  url: SITE_URL,
  sameAs: SOCIAL_LINKS.filter((s) => s.external).map((s) => s.href),
  knowsAbout: ['React', 'TypeScript', 'Node.js', 'Firebase', 'MongoDB'],
};

/**
 * Hero con cifras reales: cuenta proyectos online y tecnologías en la DB (las
 * mismas queries cacheadas que usan las otras secciones, así que no suma
 * consultas). Si una cifra da 0, queda la de hero-data.ts.
 */
async function HeroWithData() {
  const [projects, skills] = await Promise.all([getAllProjects(), getAllSkills()]);

  const { live } = splitLiveUpcoming(mapProjectsToCardData(projects));

  // Las claves deben coincidir con los `label` de HERO_STATS.
  const counts: Record<string, number> = {
    Proyectos: live.length,
    'Tecnologías': skills.length,
  };

  const stats = HERO_STATS.map((stat) => {
    const count = counts[stat.label] ?? 0;
    return count > 0 ? { ...stat, value: String(count) } : stat;
  });

  return <HeroSection stats={stats} />;
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // `<` escapado para que ningún valor pueda cerrar el <script>.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* El fallback es el mismo hero con los valores por defecto: si los datos
          tardan, la página no salta ni queda un hueco. */}
      <Suspense fallback={<HeroSection />}>
        <HeroWithData />
      </Suspense>

      <Suspense fallback={<AboutSkeleton />}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<SquadSkeleton />}>
        <SquadSection />
      </Suspense>

      <Suspense fallback={<MatchesSkeleton />}>
        <MatchesSection variant="home" />
      </Suspense>

      <TransferSection />
    </>
  );
}