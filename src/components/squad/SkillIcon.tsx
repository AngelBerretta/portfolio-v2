import Image from 'next/image';
import { Code2, MonitorSmartphone, Network, Palette, type LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { AVAILABLE_FALLBACK_ICONS } from '@/lib/constants';
import type { SquadSkill } from './types';

// `satisfies` obliga a que este objeto tenga EXACTAMENTE las mismas claves que
// AVAILABLE_FALLBACK_ICONS: si agregás un nombre en constants.ts y te olvidás
// de registrar el ícono acá (o al revés), TypeScript falla en vez de mostrar
// el ícono genérico en producción sin avisar.
const FALLBACK_ICONS = {
  Network,
  MonitorSmartphone,
  Palette,
} satisfies Record<(typeof AVAILABLE_FALLBACK_ICONS)[number], LucideIcon>;

/**
 * Ícono de una skill: logo por URL (devicon u otro CDN) o, si no hay logo,
 * un ícono Lucide por nombre. Decorativo: el nombre de la skill ya está al lado.
 */
export function SkillIcon({
  skill,
  className,
}: {
  skill: Pick<SquadSkill, 'iconUrl' | 'iconName' | 'invertIcon'>;
  className?: string;
}) {
  if (skill.iconUrl) {
    return (
      // iconUrl es una URL externa arbitraria cargada desde el admin: con
      // `unoptimized` next/image la sirve tal cual y no hace falta declarar
      // remotePatterns (mismo criterio que en el admin y en PlayerCard).
      <Image
        src={skill.iconUrl}
        alt=""
        width={20}
        height={20}
        unoptimized
        className={cn('h-5 w-5 object-contain', skill.invertIcon && 'invert', className)}
      />
    );
  }

  const Fallback = skill.iconName
    ? (FALLBACK_ICONS as Record<string, LucideIcon | undefined>)[skill.iconName]
    : undefined;
  const Icon = Fallback ?? Code2;

  return <Icon className={cn('h-[18px] w-[18px] text-accent', className)} aria-hidden="true" />;
}
