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
    <>
      {/* Esta página no tenía <h1>: el primer encabezado visible es el h2 de
          MatchesSection. Se agrega uno oculto (en vez de convertir ese h2)
          para no saltar de h1 a h3 en las tarjetas. Va fuera del Suspense
          para que esté en el HTML inicial. */}
      <h1 className="sr-only">Proyectos de Angel Berretta</h1>

      <Suspense fallback={<MatchesSkeleton />}>
        <MatchesSection variant="page" />
      </Suspense>
    </>
  );
}