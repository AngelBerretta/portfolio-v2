'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';
import { SkillSchema, ReorderSchema } from '@/lib/validations';
import { ok, err, type ActionResult } from '@/lib/action-types';
import { unstable_cache } from 'next/cache';

function revalidateAll() {
  revalidatePath('/');
  revalidatePath('/admin/skills');
}

/** Parsea el FormData del formulario de skill */
function parseSkillFormData(formData: FormData) {
  return {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    level: formData.get('level') as string,
    iconUrl: (formData.get('iconUrl') as string) ?? '',
    iconName: (formData.get('iconName') as string) ?? '',
    invertIcon: formData.get('invertIcon') === 'true',
    category: formData.get('category') as string,
    order: formData.get('order') as string,
  };
}

// ─── CREATE ──────────────────────────────────────────────────────────────────

export async function createSkill(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();

    const validated = SkillSchema.safeParse(parseSkillFormData(formData));
    if (!validated.success) {
      return err('Corregí los errores del formulario', validated.error.flatten().fieldErrors);
    }

    const skill = await prisma.skill.create({
      data: validated.data,
      select: { id: true },
    });

    revalidateAll();
    return ok({ id: skill.id });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return err('No autorizado');
    }
    console.error('[createSkill]', error);
    return err('Error interno al crear la skill');
  }
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export async function updateSkill(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAuth();

    const validated = SkillSchema.safeParse(parseSkillFormData(formData));
    if (!validated.success) {
      return err('Corregí los errores del formulario', validated.error.flatten().fieldErrors);
    }

    await prisma.skill.update({
      where: { id },
      data: validated.data,
    });

    revalidateAll();
    return ok();
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return err('No autorizado');
    }
    console.error('[updateSkill]', error);
    return err('Error interno al actualizar la skill');
  }
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

export async function deleteSkill(id: string): Promise<ActionResult> {
  try {
    await requireAuth();

    await prisma.skill.delete({ where: { id } });

    revalidateAll();
    return ok();
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return err('No autorizado');
    }
    console.error('[deleteSkill]', error);
    return err('Error interno al eliminar la skill');
  }
}

// ─── REORDER ─────────────────────────────────────────────────────────────────

export async function reorderSkills(itemsJson: string): Promise<ActionResult> {
  try {
    await requireAuth();

    const parsed = ReorderSchema.safeParse(JSON.parse(itemsJson));
    if (!parsed.success) {
      return err('Datos de orden inválidos');
    }

    await prisma.$transaction(
      parsed.data.map(({ id, order }) =>
        prisma.skill.update({ where: { id }, data: { order } })
      )
    );

    revalidateAll();
    return ok();
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return err('No autorizado');
    }
    console.error('[reorderSkills]', error);
    return err('Error interno al reordenar las skills');
  }
}

// ─── READ HELPERS ─────────────────────────────────────────────────────────────

async function _getAllSkills() {
  return prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
  });
}

// getSkillById no lo cacheamos — solo se usa en el admin
export async function getSkillById(id: string) {
  return prisma.skill.findUnique({ where: { id } });
}

/**
 * Versión cacheada de getAllSkills.
 * Mismo mecanismo que getAllProjects — se invalida cuando
 * revalidatePath('/') es llamado desde cualquier mutación del admin.
 */
export const getAllSkills = unstable_cache(
  _getAllSkills,
  ['all-skills'],
  { tags: ['skills'] }
);

/**
 * Skills agrupadas por categoría.
 * También cacheada — llama a la versión cacheada de getAllSkills
 * así ambas comparten el mismo cache entry.
 */
export const getSkillsByCategory = unstable_cache(
  async () => {
    const skills = await getAllSkills();   // usa la query base, no la cacheada
    return skills.reduce(
      (acc, skill) => {
        const cat = skill.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
      },
      {} as Record<string, typeof skills>
    );
  },
  ['skills-by-category'],
  { tags: ['skills'] }                     // mismo tag que getAllSkills
);
