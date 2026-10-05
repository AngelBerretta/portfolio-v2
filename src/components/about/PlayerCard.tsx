import Image from 'next/image';
import { cn } from '@/utils/cn';
import { ArgentinaFlag } from '@/components/shared/icons';
import { PLAYER } from './player-data';

/**
 * Carta de jugador estilo FIFA: foto, posición y atributos. Vive en "Sobre mí"
 * y es la única imagen de perfil del sitio.
 *
 * Server component y estática a propósito (sin inclinación con el mouse): así
 * no hay JS de animación ni listeners de puntero en esta sección.
 *
 * La foto la sube el admin a Vercel Blob (ya declarado en remotePatterns de
 * next.config.ts) redimensionada a 800px, así que next/image la optimiza.
 */
export function PlayerCard({
  avatarUrl,
  className,
}: {
  avatarUrl?: string | null;
  className?: string;
}) {
  const rating = Math.round(
    PLAYER.attributes.reduce((sum, a) => sum + a.value, 0) / PLAYER.attributes.length
  );
  const initials = PLAYER.name
    .split(' ')
    .map((w) => w[0])
    .join('');

  return (
    <figure
      aria-label={`Carta de jugador de ${PLAYER.name}`}
      className={cn(
        'relative overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-b from-bg-elevated to-bg-card p-5 shadow-2xl',
        className
      )}
    >
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <div className="flex flex-col items-start">
          <p className="font-display text-5xl font-bold leading-none text-accent">{rating}</p>
          <p className="mt-1.5 text-sm font-semibold text-text-primary">{PLAYER.position}</p>
          <span className="mt-3 block w-7">
            <ArgentinaFlag />
          </span>
        </div>

        <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`Foto de ${PLAYER.name}`}
              fill
              sizes="(max-width: 640px) 200px, 280px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-5xl font-bold text-text-muted">
              {initials}
            </span>
          )}
        </div>
      </div>

      <figcaption className="mt-4 text-center">
        <p className="font-display text-xl font-bold text-text-primary">{PLAYER.name}</p>
        <p className="text-sm text-text-secondary">{PLAYER.title}</p>
      </figcaption>

      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-border-subtle pt-4">
        {PLAYER.attributes.map((attr) => (
          <li key={attr.label} className="flex items-baseline gap-2">
            <span className="w-7 font-display text-lg font-bold tabular-nums text-accent">
              {attr.value}
            </span>
            <span className="truncate text-sm text-text-secondary">{attr.label}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}