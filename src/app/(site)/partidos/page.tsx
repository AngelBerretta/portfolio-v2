import { Suspense } from 'react';
import type { Metadata } from 'next';
import { MatchesSection } from '@/components/matches/MatchesSection';
import { MatchesSkeleton } from '@/components/matches/MatchesSkeleton';
import { buildOpenGraph } from '@/lib/site';

// El título dice "Proyectos" (no "Partidos") a propósito: es lo que busca un
// reclutador y lo que indexa Google. "Partidos" es solo el nombre en el menú.
// El layout raíz le agrega el sufijo: "Proyectos | Angel Berretta".
const TITLE = 'Proyectos';
const DESCRIPTION =
  'Todos los proyectos full stack, frontend y landing pages desarrollados por Angel Berretta.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/partidos' },
  openGraph: buildOpenGraph({
    title: `${TITLE} | Angel Berretta`,
    description: DESCRIPTION,
    path: '/partidos',
  }),
};

export default function PartidosPage() {
  return (
    <Suspense fallback={<MatchesSkeleton />}>
      <MatchesSection variant="page" />
    </Suspense>
  );
}