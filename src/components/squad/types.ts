/** Debe coincidir con SKILL_CATEGORIES en lib/constants.ts y con Skill.category en la DB. */
export type SkillCategoryId = 'frontend' | 'backend' | 'tools';

/**
 * Skill ya "aplanada" para el cliente: sin Dates ni campos que no se usan.
 * `Skill.level` sigue en la DB pero ya no se muestra, así que no viaja al cliente.
 */
export interface SquadSkill {
  id: string;
  name: string;
  /** '' si la skill no tiene descripción. */
  description: string;
  iconUrl: string | null;
  iconName: string | null;
  invertIcon: boolean;
}

/** Una skill + el "equipo" al que pertenece (su categoría). */
export interface SquadPlayer {
  skill: SquadSkill;
  team: SkillCategoryId;
}