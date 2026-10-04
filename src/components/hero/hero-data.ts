// hero-data.ts — todo el contenido editable del hero en un solo lugar.

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

/** Valores por defecto. En la fase 11 se pueden pasar reales desde la DB
 *  (ej: cantidad de proyectos y skills) vía la prop `stats` de HeroSection. */
export const HERO_STATS: HeroStat[] = [
  { value: '8+', label: 'Proyectos' },
  { value: '1+', label: 'Año freelance' },
  { value: '20+', label: 'Tecnologías' },
];

export interface PlayerAttribute {
  label: string;
  value: number;
}

/** Datos de la carta de jugador.
 *  OJO: los números son una autoevaluación de EJEMPLO — editalos a gusto.
 *  La puntuación general (la cifra grande) se calcula sola como el promedio. */
export const PLAYER = {
  name: 'Angel Berretta',
  position: 'FS',
  title: 'Full Stack Developer',
  attributes: [
    { label: 'Frontend', value: 88 },
    { label: 'Backend', value: 76 },
    { label: 'UI / UX', value: 80 },
    { label: 'Bases de datos', value: 72 },
    { label: 'Aprendizaje', value: 92 },
    { label: 'Compromiso', value: 90 },
  ] satisfies PlayerAttribute[],
};