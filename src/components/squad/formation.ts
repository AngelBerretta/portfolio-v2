// formation.ts — reparte N jugadores en líneas (arquero, defensa, medio,
// ataque). Matemática pura, sin React.
//
// Con 11 jugadores da un 4-3-3. Con menos, la formación se encoge sola
// (10 → 3-3-3, 8 → 3-2-2, ...), así la cancha nunca se ve con huecos.
//
// Orden de asignación: los PRIMEROS de la lista juegan de delanteros y el
// ÚLTIMO de arquero. Para cambiar quién juega dónde, se reordena en el admin.

export type LineId = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface FormationLine<T> {
  id: LineId;
  players: T[];
}

/** Devuelve las líneas ordenadas desde el arco propio hacia el centro. */
export function buildFormation<T>(players: T[]): FormationLine<T>[] {
  const n = players.length;
  if (n === 0) return [];

  const outfield = n - 1;
  const def = Math.ceil(outfield / 3);
  const rest = outfield - def;
  const mid = Math.ceil(rest / 2);
  const fwd = rest - mid;

  const lines: FormationLine<T>[] = [
    { id: 'GK', players: players.slice(n - 1) },
    { id: 'DEF', players: players.slice(fwd + mid, fwd + mid + def) },
    { id: 'MID', players: players.slice(fwd, fwd + mid) },
    { id: 'FWD', players: players.slice(0, fwd) },
  ];

  return lines.filter((line) => line.players.length > 0);
}