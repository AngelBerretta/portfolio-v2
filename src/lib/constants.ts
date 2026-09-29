export const PROJECT_CATEGORIES = [
  { value: 'fullstack', label: 'Full Stack' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'landing', label: 'Landing Page' },
] as const;

export const PROJECT_STATUSES = [
  { value: '', label: 'Sin estado (proyecto live normal)' },
  { value: 'in-progress', label: 'En construcción' },
  { value: 'coming-soon', label: 'Próximamente' },
] as const;

// Metadata de tabs para la sección pública de Proyectos (no vive en la DB,
// es solo la config visual de los filtros — id debe matchear Project.category).
export const PROJECT_FILTER_TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'landing', label: 'Landing Pages' },
] as const;

// IMPORTANTE: estos valores deben coincidir exactamente con los "id" de
// categorías usados en el componente público Skills.tsx (estética terminal).
export const SKILL_CATEGORIES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'tools', label: 'Tools' },
] as const;

// Íconos de Lucide disponibles como fallback cuando una skill no tiene
// ícono de devicon (ej: "API REST", "Responsive Design", "UI/UX").
// Si agregás una skill sin devicon, usá uno de estos nombres en iconName,
// o agregá uno nuevo acá Y en src/components/SkillsClient.tsx (FALLBACK_ICONS).
export const AVAILABLE_FALLBACK_ICONS = ['Network', 'MonitorSmartphone', 'Palette'] as const;

/** Genera un slug a partir de un título: "Mi Proyecto Cool" -> "mi-proyecto-cool" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // saca acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
