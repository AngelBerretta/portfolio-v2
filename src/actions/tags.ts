'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';
import { TagSchema } from '@/lib/validations';
import { ok, err, type ActionResult } from '@/lib/action-types';
import type { Tag } from '@prisma/client';

// ─── CREATE ──────────────────────────────────────────────────────────────────

export async function createTag(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult<Tag>> {
  try {
    await requireAuth();

    const raw = { name: formData.get('name') as string };
    const validated = TagSchema.safeParse(raw);

    if (!validated.success) {
      return err('Nombre de tag inválido', validated.error.flatten().fieldErrors);
    }

    // Si ya existe, devuelve el existente en lugar de fallar
    const tag = await prisma.tag.upsert({
      where: { name: validated.data.name },
      update: {},
      create: { name: validated.data.name },
    });

    revalidatePath('/admin/projects');
    return ok(tag);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return err('No autorizado');
    }
    console.error('[createTag]', error);
    return err('Error interno al crear el tag');
  }
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

export async function deleteTag(id: string): Promise<ActionResult> {
  try {
    await requireAuth();

    // Verificar si el tag está siendo usado por algún proyecto
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: { _count: { select: { projects: true } } },
    });

    if (!tag) {
      return err('El tag no existe');
    }

    if (tag._count.projects > 0) {
      return err(
        `Este tag está siendo usado por ${tag._count.projects} proyecto(s). ` +
          'Quitalo de los proyectos antes de eliminarlo.'
      );
    }

    await prisma.tag.delete({ where: { id } });

    revalidatePath('/admin/projects');
    return ok();
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return err('No autorizado');
    }
    console.error('[deleteTag]', error);
    return err('Error interno al eliminar el tag');
  }
}

// ─── READ ────────────────────────────────────────────────────────────────────

/** Todos los tags con cuántos proyectos los usan */
export async function getAllTags() {
  return prisma.tag.findMany({
    include: {
      _count: { select: { projects: true } },
    },
    orderBy: { name: 'asc' },
  });
}