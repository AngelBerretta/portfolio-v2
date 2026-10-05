import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowDown, Mail } from 'lucide-react';
import { Badge } from '@/components/shared/Badge';
import { ArgentinaFlag, GitHubIcon, LinkedInIcon } from '@/components/shared/icons';
import { BallStage } from './BallStage';
import { StatsHUD } from './StatsHUD';
import { TypedRole } from './TypedRole';
import { HERO_STATS, ROLES, SOCIAL_LINKS, type HeroStat } from './hero-data';

// Se renderiza en el SERVIDOR: el h1, el texto y los CTAs llegan en el HTML
// inicial (buen LCP, sin esperar hidratación). Solo TypedRole y BallStage son
// islas cliente. La entrada animada es CSS puro (.hero-intro, ver globals.css):
// sin parpadeo y sin depender de JS.

const SOCIAL_ICONS = {
  github: <GitHubIcon />,
  linkedin: <LinkedInIcon />,
  email: <Mail size={20} />,
} as const;

const delay = (seconds: number) => ({ '--hero-delay': `${seconds}s` }) as CSSProperties;

const primaryLink =
  'inline-flex h-12 items-center justify-center rounded-md border border-transparent bg-accent px-6 text-base font-medium text-text-inverse transition-all duration-200 hover:bg-accent-dim';
const outlineLink =
  'inline-flex h-12 items-center justify-center rounded-md border border-border bg-transparent px-6 text-base font-medium text-text-primary transition-all duration-200 hover:border-accent hover:text-accent';
const iconLink =
  'inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent';

export function HeroSection({ stats = HERO_STATS }: { stats?: HeroStat[] }) {
  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 md:pb-24"
    >
      {/* Fondo: líneas de cancha (círculo central + línea media) y un resplandor */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 left-1/2 w-px bg-border-ghost" />
        <div className="absolute left-1/2 top-1/2 hidden h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border-ghost sm:block" />
        <div className="absolute right-[6%] top-1/4 h-[28rem] w-[28rem] rounded-full bg-accent-ghost blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        {/* ── Texto ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="hero-intro font-display text-5xl font-bold leading-none tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            Angel <span className="text-accent">Berretta</span>
          </h1>

          <div className="hero-intro mt-5 w-full" style={delay(0.15)}>
            <TypedRole roles={ROLES} />
          </div>

          <p
            className="hero-intro mt-4 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg"
            style={delay(0.25)}
          >
            Desarrollador Web Full Stack en continua formación{' '}
            <br className="hidden sm:block" />
            de Buenos Aires, Argentina{' '}
            <span className="inline-block w-5 align-middle">
              <ArgentinaFlag />
            </span>
            <br />
            <span className="font-medium text-text-primary">
              ¡Estoy listo para aportar creatividad y compromiso a nuevos desafíos!
            </span>
          </p>

          <div className="hero-intro mt-6" style={delay(0.3)}>
            <Badge variant="win" className="px-4 py-1.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-win motion-safe:animate-pulse" />
              Disponible para trabajar
            </Badge>
          </div>

          <div
            className="hero-intro mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            style={delay(0.35)}
          >
            <Link href="/#projects" className={primaryLink}>
              Ver proyectos
            </Link>
            <Link href="/#contact" className={outlineLink}>
              Contactame
            </Link>
          </div>

          <ul className="hero-intro mt-8 flex items-center gap-3" style={delay(0.4)}>
            {SOCIAL_LINKS.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target={s.external ? '_blank' : undefined}
                  rel={s.external ? 'noopener noreferrer' : undefined}
                  aria-label={s.label}
                  className={iconLink}
                >
                  {SOCIAL_ICONS[s.id]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Balón ─────────────────────────────────────────────
            Solo desde lg (donde el hero pasa a dos columnas). Por debajo queda
            oculto con display:none, y BallStage no descarga three.js hasta que
            el balón entra en pantalla, así que en mobile no cuesta nada. */}
        <div
          className="hero-intro hidden items-center justify-center lg:flex"
          style={delay(0.3)}
        >
          <BallStage className="pointer-events-none aspect-square w-full max-w-[26rem] xl:max-w-[30rem]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-14 w-full max-w-6xl md:mb-8">
        <StatsHUD stats={stats} delay={0.5} />
      </div>

      <Link
        href="/#about"
        aria-label="Ir a la sección Sobre mí"
        className="hero-intro absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-text-muted transition-colors hover:text-accent md:flex"
        style={delay(1.2)}
      >
        <span className="text-xs">Scroll</span>
        <ArrowDown className="h-4 w-4 motion-safe:animate-bounce" />
      </Link>
    </section>
  );
}