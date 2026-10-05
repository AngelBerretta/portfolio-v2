// hero-data.ts — todo el contenido editable del hero en un solo lugar.
// (Los datos de la carta de jugador pasaron a about/player-data.ts.)

/** Roles que escribe el typewriter. Constante de módulo = identidad estable. */
export const ROLES = [
  'Full Stack Developer',
  'UI / UX Enthusiast',
  'Freelance Developer',
] as const;

export const SOCIAL_LINKS = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/AngelBerretta', external: true },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/angelberretta', external: true },
  { id: 'email', label: 'Email', href: 'mailto:angelberretta.dev@gmail.com', external: false },
] as const;

export interface HeroStat {
  value: string;
  label: string;
}

/** Valores por defecto. page.tsx los pisa con los reales de la DB
 *  (cantidad de proyectos online y de tecnologías) cuando hay datos. */
export const HERO_STATS: HeroStat[] = [
  { value: '8+', label: 'Proyectos' },
  { value: '1+', label: 'Año freelance' },
  { value: '20+', label: 'Tecnologías' },
];