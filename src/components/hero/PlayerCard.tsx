'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { gsap, useGSAP } from '@/animations/gsap.config';
import { ArgentinaFlag } from '@/components/shared/icons';
import { PLAYER } from './hero-data';

const TILT_MAX = 12; // grados

/** Carta de jugador estilo FIFA con inclinación 3D según el mouse. */
export function PlayerCard({
  avatarUrl,
  className,
}: {
  avatarUrl?: string | null;
  className?: string;
}) {
  const cardRef = useRef<HTMLElement>(null);

  const rating = Math.round(
    PLAYER.attributes.reduce((sum, a) => sum + a.value, 0) / PLAYER.attributes.length
  );
  const initials = PLAYER.name
    .split(' ')
    .map((w) => w[0])
    .join('');

  // Tilt: solo con mouse real y sin reduced-motion. En touch/reduced la
  // carta queda quieta. useGSAP revierte todo y matchMedia desmonta los
  // listeners al salir.
  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;

      const mm = gsap.matchMedia();

      mm.add(
        '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.set(card, { transformPerspective: 900 });
          const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
          const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });

          const onMove = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            rotY(px * TILT_MAX * 2);
            rotX(-py * TILT_MAX * 2);
          };
          const onLeave = () => {
            rotX(0);
            rotY(0);
          };

          card.addEventListener('pointermove', onMove);
          card.addEventListener('pointerleave', onLeave);
          return () => {
            card.removeEventListener('pointermove', onMove);
            card.removeEventListener('pointerleave', onLeave);
          };
        }
      );

      return () => mm.revert();
    },
    { scope: cardRef }
  );

  return (
    <figure
      ref={cardRef}
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
              alt=""
              fill
              sizes="160px"
              className="object-cover"
              // Las fotos subidas desde el admin ya salen redimensionadas
              // (800px) por ImageUploader, y viven en un host externo:
              // las servimos tal cual y evitamos tener que declarar
              // remotePatterns. Las rutas locales (/images/...) sí se optimizan.
              unoptimized={avatarUrl.startsWith('http')}
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