import type { Project, Tag } from '@prisma/client';
import { isUpcoming, type ProjectCardData, type ProjectCategory, type ProjectStatus } from './types';

type ProjectWithTags = Project & { tags: Tag[] };

const CATEGORIES: readonly string[] = ['fullstack', 'frontend', 'landing'];
const STATUSES: readonly string[] = ['live', 'in-progress', 'coming-soon'];

// Project.category / Project.status son String en la DB (no enums), así que
// validamos en vez de castear a ciegas. Una categoría desconocida cae a
// 'fullstack' en lugar de romper la tarjeta.
function toCategory(value: string): ProjectCategory {
  return CATEGORIES.includes(value) ? (value as ProjectCategory) : 'fullstack';
}

function toStatus(value: string | null): ProjectStatus | undefined {
  return value && STATUSES.includes(value) ? (value as ProjectStatus) : undefined;
}

export function mapProjectsToCardData(projects: ProjectWithTags[]): ProjectCardData[] {
  return projects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.imageUrl,
    tags: p.tags.map((t) => t.name),
    codeUrl: p.codeUrl,
    demoUrl: p.demoUrl,
    category: toCategory(p.category),
    featured: p.featured,
    status: toStatus(p.status),
    statusLabel: p.statusLabel ?? undefined,
  }));
}

/** Titulares (terminados, online) y suplentes (en desarrollo). */
export function splitLiveUpcoming(projects: ProjectCardData[]) {
  return {
    live: projects.filter((p) => !isUpcoming(p.status)),
    upcoming: projects.filter((p) => isUpcoming(p.status)),
  };
}