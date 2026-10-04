import { Suspense } from 'react';
import type { Metadata } from 'next';
import { MatchesSection } from '@/components/matches/MatchesSection';
import { MatchesSkeleton } from '@/components/matches/MatchesSkeleton';

// El título dice "Proyectos" (no "Partidos") a propósito: es lo que busca un
// reclutador y lo que indexa Google. "Partidos" es solo el nombre en el menú.
export const metadata: Metadata = {
  title: 'Proyectos — Angel Berretta',
  description:
    'Todos los proyectos full stack, frontend y landing pages desarrollados por Angel Berretta.',
};

export default function PartidosPage() {
  return (
    <Suspense fallback={<MatchesSkeleton />}>
      <MatchesSection variant="page" />
    </Suspense>
  );
}