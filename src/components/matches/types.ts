export type ProjectCategory = 'fullstack' | 'frontend' | 'landing';
export type ProjectStatus = 'live' | 'in-progress' | 'coming-soon';

export interface ProjectCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  codeUrl: string;
  demoUrl: string;
  category: ProjectCategory;
  featured: boolean;
  status?: ProjectStatus;
  statusLabel?: string;
}

/**
 * "Suplente" = proyecto todavía en desarrollo. Un status explícito 'live'
 * (válido en el schema aunque el admin no lo ofrezca) cuenta como titular,
 * igual que no tener status.
 */
export function isUpcoming(status?: ProjectStatus): boolean {
  return status === 'in-progress' || status === 'coming-soon';
}