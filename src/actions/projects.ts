'use server';

import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';
import { ProjectSchema, ReorderSchema } from '@/lib/validations';
import { ok, err, type ActionResult } from '@/lib/action-types';

// ─── Helpers internos ────────────────────────────────────────────────────────

/** Parsea el FormData del formulario de proyecto */
function parseProjectFormData(formData: FormData) {
  return {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    imageUrl: formData.get('imageUrl') as string,
    codeUrl: formData.get('codeUrl') as string,
    demoUrl: formData.get('demoUrl') as string,
    category: formData.get('category') as string,
    featured: formData.get('featured') === 'true',
    status: (formData.get('status') as string) || null,
    statusLabel: (formData.get('statusLabel') as string) || null,
    order: parseInt((formData.get('order') as string) ?? '0', 10) || 0,
    // Los tags vienen como múltiples valores con el mismo nombre
    tags: formData.getAll('tags') as string[],
  };
}

/**
 * Dado un array de nombres de tags, los crea si no existen y devuelve sus IDs.
 * Usado para conectar tags a un proyecto con Prisma's `set`.
 */
async function upsertTags(names: string[]) {
  return Promise.all(
    names.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
        select: { id: true },
      })
    )
  );
}

/**
 * Invalida todas las páginas que muestran proyectos.
 * Se llama después de cada mutación (create, update, delete, reorder).
 */
function revalidateAll() {
  revalidatePath('/');
  revalidatePath('/proyectos');
  revalidatePath('/admin/projects');
  revalidateTag('projects', '');
}

// ─── CREATE ──────────────────────────────────────────────────────────────────

export async function createProject(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();

    const raw = parseProjectFormData(formData);
    const validated = ProjectSchema.safeParse(raw);

    if (!validated.success) {
      return err('Corregí los errores del formulario', validated.error.flatten().fieldErrors);
    }

    const { tags, ...projectData } = validated.data;

    // Verificar que el slug no esté duplicado
    const existing = await prisma.project.findUnique({
      where: { slug: projectData.slug },
      select: { id: true },
    });
    if (existing) {
      return err('El slug ya está en uso', { slug: ['Este slug ya existe, elegí otro'] });
    }

    const tagRecords = await upsertTags(tags);

    const project = await prisma.project.create({
      data: {
        ...projectData,
        tags: { connect: tagRecords },
      },
      select: { id: true },
    });

    revalidateAll();
    return ok({ id: project.id });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return err('No autorizado');
    }
    console.error('[createProject]', error);
    return err('Error interno al crear el proyecto');
  }
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export async function updateProject(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAuth();

    const raw = parseProjectFormData(formData);
    const validated = ProjectSchema.safeParse(raw);

    if (!validated.success) {
      return err('Corregí los errores del formulario', validated.error.flatten().fieldErrors);
    }

    const { tags, ...projectData } = validated.data;

    // Verificar que el slug no esté en uso por OTRO proyecto
    const existing = await prisma.project.findUnique({
      where: { slug: projectData.slug },
      select: { id: true },
    });
    if (existing && existing.id !== id) {
      return err('El slug ya está en uso', { slug: ['Este slug ya existe, elegí otro'] });
    }

    const tagRecords = await upsertTags(tags);

    await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        tags: {
          // `set` desconecta todos los tags anteriores y conecta los nuevos
          set: tagRecords,
        },
      },
    });

    revalidateAll();
    return ok();
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return err('No autorizado');
    }
    console.error('[updateProject]', error);
    return err('Error interno al actualizar el proyecto');
  }
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAuth();

    await prisma.project.delete({ where: { id } });

    revalidateAll();
    return ok();
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return err('No autorizado');
    }
    console.error('[deleteProject]', error);
    return err('Error interno al eliminar el proyecto');
  }
}

// ─── REORDER ─────────────────────────────────────────────────────────────────

/**
 * Recibe un JSON string con [{ id, order }] y actualiza el orden de cada proyecto.
 * Llamado desde el drag-and-drop de la tabla de proyectos.
 */
export async function reorderProjects(
  itemsJson: string
): Promise<ActionResult> {
  try {
    await requireAuth();

    const parsed = ReorderSchema.safeParse(JSON.parse(itemsJson));
    if (!parsed.success) {
      return err('Datos de orden inválidos');
    }

    // Actualizar en paralelo con una transacción
    await prisma.$transaction(
      parsed.data.map(({ id, order }) =>
        prisma.project.update({
          where: { id },
          data: { order },
        })
      )
    );

    revalidateAll();
    return ok();
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return err('No autorizado');
    }
    console.error('[reorderProjects]', error);
    return err('Error interno al reordenar los proyectos');
  }
}

// ─── READ HELPERS (para Server Components) ───────────────────────────────────

/**
 * Trae todos los proyectos ordenados. Usado en Home y en /proyectos.
 * No usa un caché propio: la deduplicación/caché de la respuesta la maneja
 * el Full Route Cache de Next.js vía `export const revalidate` en cada
 * página, que se invalida con revalidatePath() en cada mutación de arriba.
 */
async function _getAllProjects() {
  return prisma.project.findMany({
    include: { tags: true },
    orderBy: { order: 'asc' },
  });
}

export const getAllProjects = unstable_cache(
  _getAllProjects,
  ['all-projects'],
  { tags: ['projects'] }
);

// getProjectById no lo cacheamos — solo se usa en el admin
// donde siempre queremos datos frescos
export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: { tags: true },
  });
}