import { getProfile } from '@/actions/profile';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Reveal } from '@/components/shared/Reveal';
import { AboutContent } from './AboutContent';
import { PlayerCard } from './PlayerCard';

/**
 * Sección "Sobre mí". Server component async: quien la use debe envolverla en
 * <Suspense fallback={<AboutSkeleton />}> (cacheComponents), igual que
 * SquadSection y MatchesSection.
 *
 * Usa id="about" porque es el que espera el scroll spy y nav-items.ts.
 */
export async function AboutSection() {
  const profile = await getProfile();

  // El perfil se siembra con prisma/seed.ts. Si todavía no existe, la sección
  // no se muestra en vez de romper la página.
  if (!profile) return null;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-accent-ghost blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="about-heading"
          eyebrow="01 · Sobre mí"
          title="¿Quién soy?"
          description="Quién está detrás del código, en pocas líneas."
        />

        <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal direction="left" className="mx-auto w-full max-w-[19rem] sm:max-w-sm">
            <PlayerCard avatarUrl={profile.avatarUrl} />
          </Reveal>

          <AboutContent
            bio={profile.bio}
            cvUrl={profile.cvUrl}
            facts={{
              location: profile.location,
              education: profile.education,
              experience: profile.experience,
              currentFocus: profile.currentFocus,
            }}
          />
        </div>
      </div>
    </section>
  );
}