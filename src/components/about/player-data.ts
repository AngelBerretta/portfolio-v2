// player-data.ts — datos de la carta de jugador (sección "Sobre mí").
// Antes vivían en hero/hero-data.ts. También los lee app/opengraph-image.tsx.

export interface PlayerAttribute {
  label: string;
  value: number;
}

/** OJO: los números son una autoevaluación de EJEMPLO — editalos a gusto.
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