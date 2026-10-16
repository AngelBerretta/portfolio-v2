// player-data.ts — datos de la carta de jugador (sección "Sobre mí").
// También los lee app/opengraph-image.tsx.
//
// Los atributos Frontend / Backend / UI-UX / Bases de datos se calculan a
// partir de los proyectos (ver player-stats.ts). Acá solo se editan los que
// son una valoración personal y los valores de respaldo.

export interface PlayerAttribute {
  label: string;
  value: number;
}

export const PLAYER = {
  name: 'Angel Berretta',
  position: 'FS',
  title: 'Full Stack Developer',
};

/** Se editan a mano. Aparecen al final de la carta, después de los calculados. */
export const MANUAL_ATTRIBUTES: PlayerAttribute[] = [
  { label: 'Aprendizaje', value: 60 },
  { label: 'Compromiso', value: 99 },
];

/** Valores de respaldo: se usan si todavía no hay proyectos o la DB no responde.
 *  El orden y los labels deben coincidir con AREAS en player-stats.ts. */
export const FALLBACK_ATTRIBUTES: PlayerAttribute[] = [
  { label: 'Frontend', value: 88 },
  { label: 'Backend', value: 76 },
  { label: 'UI / UX', value: 80 },
  { label: 'Bases de datos', value: 72 },
];

/** Puntuación general (la cifra grande): promedio de todos los atributos. */
export function overallRating(attributes: PlayerAttribute[]): number {
  if (attributes.length === 0) return 0;
  return Math.round(attributes.reduce((sum, a) => sum + a.value, 0) / attributes.length);
}