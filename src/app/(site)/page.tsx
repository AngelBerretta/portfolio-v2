// TEMPORAL — el hero ya es real; el resto sigue siendo placeholder hasta las
// fases 7–10. En la fase 11 se reemplaza por el ensamblado final.
//
// Para mostrar la foto real en la carta: traé el perfil con getProfile()
// (src/actions/profile.ts) y pasá `avatarUrl={profile?.avatarUrl}`. Ojo con
// cacheComponents: hacelo dentro de un <Suspense> o con datos cacheados.

import { HeroSection } from '@/components/hero/HeroSection';

const PLACEHOLDER_SECTIONS = [
  { id: 'about', title: 'Sobre mí' },
  { id: 'skills', title: 'Plantel' },
  { id: 'projects', title: 'Partidos' },
  { id: 'contact', title: 'Fichaje' },
] as const;

export default function HomePage() {
  return (
    <>
      <HeroSection avatarUrl="/images/avatar.jpg" />

      {PLACEHOLDER_SECTIONS.map(({ id, title }) => (
        <section
          key={id}
          id={id}
          className="flex min-h-dvh items-center justify-center border-b border-border-subtle px-6"
        >
          <h2 className="font-display text-4xl font-bold md:text-6xl">{title}</h2>
        </section>
      ))}
    </>
  );
}