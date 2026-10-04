/** Debe coincidir con SKILL_CATEGORIES en lib/constants.ts y con Skill.category en la DB. */
export type SkillCategoryId = 'frontend' | 'backend' | 'tools';

/** Skill ya "aplanada" para el cliente: sin Dates ni campos que no se usan. */
export interface SquadSkill {
  id: string;
  name: string;
  /** '' si la skill no tiene descripción. */
  description: string;
  /** 0–100. */
  level: number;
  iconUrl: string | null;
  iconName: string | null;
  invertIcon: boolean;
}

export interface PositionGroupData {
  id: SkillCategoryId;
  /** Nombre en lenguaje llano — es lo que se lee primero: "Frontend". */
  title: string;
  /** Nombre futbolero, secundario: "Delanteros". */
  position: string;
  /** Código decorativo estilo planilla: "DEL". */
  code: string;
  /** Qué significa el grupo, en una línea y sin metáfora. */
  hint: string;
  /** Clases completas de Tailwind (deben estar escritas enteras para que se generen). */
  style: { badge: string; code: string };
  skills: SquadSkill[];
}
