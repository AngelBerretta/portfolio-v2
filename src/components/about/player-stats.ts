import { getAllProjects } from '@/actions/projects';
import { FALLBACK_ATTRIBUTES, MANUAL_ATTRIBUTES, type PlayerAttribute } from './player-data';

// Forma mínima que necesitamos de un proyecto. No importamos el tipo de Prisma
// porque getAllProjects pasa por unstable_cache (serializa a JSON).
interface ProjectLike {
  category: string;
  status: string | null;
  tags: { name: string }[];
}

interface Area {
  label: string;
  /** Un proyecto de estas categorías suma al área. */
  categories: string[];
  /** Un proyecto con alguno de estos tags suma al área. */
  tags: string[];
}

// Para cambiar qué cuenta en cada área, se edita acá. Los tags se comparan sin
// importar mayúsculas, puntos, espacios ni guiones ("Node.js" = "nodejs").
// Los labels deben coincidir con FALLBACK_ATTRIBUTES.
const AREAS: Area[] = [
  {
    label: 'Frontend',
    categories: ['frontend', 'fullstack', 'landing'],
    tags: [],
  },
  {
    label: 'Backend',
    categories: ['fullstack'],
    tags: ['Node.js', 'Express', 'Firebase', 'Firestore', 'MongoDB', 'Prisma', 'PostgreSQL', 'JWT', 'Socket.io'],
  },
  {
    label: 'UI / UX',
    categories: ['landing'],
    tags: ['Tailwind', 'CSS', 'Figma', 'GSAP', 'Framer Motion', 'Sass', 'Bootstrap'],
  },
  {
    label: 'Bases de datos',
    categories: [],
    tags: ['Firebase', 'Firestore', 'MongoDB', 'PostgreSQL', 'Prisma', 'MySQL', 'SQL', 'Supabase'],
  },
];

// Cuánto vale cada proyecto según su estado. Sin estado = terminado y online.
const STATUS_WEIGHT: Record<string, number> = {
  live: 1,
  'in-progress': 0.5,
  'coming-soon': 0,
};

// Curva: FLOOR con 0 puntos, tendiendo a CEIL a medida que suman proyectos.
// SPREAD controla la velocidad: más alto = hacen falta más proyectos para
// acercarse al tope.
const FLOOR = 40;
const CEIL = 95;
const SPREAD = 4;

const normalize = (value: string) => value.toLowerCase().replace(/[\s.\-_]/g, '');

const weightOf = (status: string | null) => (status ? (STATUS_WEIGHT[status] ?? 1) : 1);

const toValue = (points: number) =>
  Math.round(FLOOR + (CEIL - FLOOR) * (1 - Math.exp(-points / SPREAD)));

/** Atributos de la carta: los calculados + los manuales. Función pura. */
export function computeAttributes(projects: ProjectLike[]): PlayerAttribute[] {
  const derived =
    projects.length === 0
      ? FALLBACK_ATTRIBUTES
      : AREAS.map((area) => {
          const areaTags = new Set(area.tags.map(normalize));

          const points = projects.reduce((sum, project) => {
            const matches =
              area.categories.includes(project.category) ||
              project.tags.some((tag) => areaTags.has(normalize(tag.name)));
            return matches ? sum + weightOf(project.status) : sum;
          }, 0);

          return { label: area.label, value: toValue(points) };
        });

  return [...derived, ...MANUAL_ATTRIBUTES];
}

/** Lee los proyectos (query cacheada, la misma del resto del sitio) y calcula. */
export async function getPlayerAttributes(): Promise<PlayerAttribute[]> {
  try {
    return computeAttributes(await getAllProjects());
  } catch (error) {
    console.error('[getPlayerAttributes]', error);
    return computeAttributes([]);
  }
}