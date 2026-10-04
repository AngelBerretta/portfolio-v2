import type { ProjectCategory } from './types';

export interface CategoryStyle {
  label: string;
  /** Clases para <Badge className=…>: pisan los colores del variant "default". */
  className: string;
}

export const categoryConfig: Record<ProjectCategory, CategoryStyle> = {
  fullstack: {
    label: 'Full Stack',
    className: 'border-pos-champions/30 bg-pos-champions/10 text-pos-champions',
  },
  frontend: {
    label: 'Frontend',
    className: 'border-pos-continental/30 bg-pos-continental/10 text-pos-continental',
  },
  landing: {
    label: 'Landing',
    className:
      'border-pos-champions-playoff/30 bg-pos-champions-playoff/10 text-pos-champions-playoff',
  },
};

/** Para categorías desconocidas que pudieran llegar de la DB: no rompe el render. */
export const FALLBACK_CATEGORY: CategoryStyle = {
  label: 'Proyecto',
  className: 'border-border bg-bg-elevated text-text-secondary',
};