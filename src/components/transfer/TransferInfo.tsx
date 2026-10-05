import type { ReactNode } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Reveal } from '@/components/shared/Reveal';
import { GitHubIcon, LinkedInIcon } from '@/components/shared/icons';
import { SOCIAL_LINKS } from '@/components/hero/hero-data';
import {
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  CONTACT_PHONE,
  RESPONSE_TIME,
  SCHEDULE,
  SCHEDULE_TIMEZONE,
} from './transfer-data';

const CONTACT_ROWS = [
  { icon: Mail, label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: Phone, label: 'Teléfono', value: CONTACT_PHONE.label, href: CONTACT_PHONE.href },
  { icon: MapPin, label: 'Ubicación', value: CONTACT_LOCATION, href: null },
];

// El email ya tiene su propia fila arriba, por eso no tiene icono acá y el
// filtro de abajo lo deja afuera.
const SOCIAL_ICONS: Record<string, ReactNode | undefined> = {
  github: <GitHubIcon className="h-5 w-5" />,
  linkedin: <LinkedInIcon className="h-5 w-5" />,
};

const socials = SOCIAL_LINKS.filter((s) => SOCIAL_ICONS[s.id]);

/** Columna izquierda del contacto. Server component; Reveal es la única isla cliente. */
export function TransferInfo() {
  return (
    <Reveal direction="left" className="space-y-4">
      {/* Disponibilidad. Mismo patrón que ScoreBadge: código decorativo + texto
          en lenguaje llano. "Libre" = jugador sin contrato, disponible para fichar. */}
      <div className="rounded-xl border border-accent/25 bg-accent-ghost p-6">
        <span
          title="Disponible para incorporarme a un equipo o proyecto"
          className="inline-flex items-stretch overflow-hidden rounded-md border border-win/30 bg-win/10 font-mono text-[11px] font-semibold text-win"
        >
          <span aria-hidden="true" className="bg-win px-1.5 py-0.5 tracking-wider text-text-inverse">
            LIBRE
          </span>
          <span className="px-2 py-0.5">Disponible ahora</span>
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-text-primary">
          Listo para nuevos proyectos
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
          Full Time o por proyecto, en remoto o presencial en Buenos Aires.
        </p>
      </div>

      <ul className="space-y-2">
        {CONTACT_ROWS.map(({ icon: Icon, label, value, href }) => (
          <li
            key={label}
            className="flex items-center gap-4 rounded-lg border border-border-subtle bg-bg-card p-3.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-bg-surface">
              <Icon className="h-[18px] w-[18px] text-accent" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-text-muted">{label}</p>
              {href ? (
                <a
                  href={href}
                  className="block break-words text-sm font-medium text-text-primary transition-colors hover:text-accent"
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm font-medium text-text-primary">{value}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border-subtle bg-bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">Redes</h3>
          <ul className="flex gap-2">
            {socials.map((s) => (
              <li key={s.id} className="flex-1">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  {SOCIAL_ICONS[s.id]}
                  {s.label}
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border-subtle bg-bg-card p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-text-primary">
            <Clock className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            Horario
          </h3>
          <dl className="space-y-1 text-xs">
            {SCHEDULE.map((s) => (
              <div key={s.days} className="flex items-center justify-between gap-3">
                <dt className="text-text-secondary">{s.days}</dt>
                <dd className="font-semibold tabular-nums text-text-primary">{s.hours}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 border-t border-border-subtle pt-2.5 text-xs text-text-muted">
            {SCHEDULE_TIMEZONE}. Respondo en {RESPONSE_TIME}.
          </p>
        </div>
      </div>
    </Reveal>
  );
}
