// TEMPORAL — página de prueba del checklist de la fase 5. Se puede borrar
// cuando termines de validar. Mientras tanto, en producción devuelve 404
// para que no se publique por accidente.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AnimationsTest } from './AnimationsTest';

export const metadata: Metadata = {
  title: 'Animations test',
  robots: { index: false, follow: false },
};

export default function AnimationsTestPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <AnimationsTest />;
}