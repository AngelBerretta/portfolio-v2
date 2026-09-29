'use server';

import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';
import { ProfileSchema } from '@/lib/validations';
import { ok, err, type ActionResult } from '@/lib/action-types';
import type { Profile } from '@prisma/client';

// ─── UPDATE ──────────────────────────────────────────────────────────────────

/**
 * El perfil es un singleton (siempre una sola fila).
 * Si por alguna razón no existe, lo crea.
 */
export async function updateProfile(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAuth();

    const raw = {
      bio: formData.get('bio') as string,
      avatarUrl: formData.get('avatarUrl') as string,
      location: formData.get('location') as string,
      education: formData.get('education') as string,
      experience: formData.get('experience') as string,
      currentFocus: formData.get('currentFocus') as string,
      cvUrl: (formData.get('cvUrl') as string) || null,
    };

    const validated = ProfileSchema.safeParse(raw);
    if (!validated.success) {
      return err('Corregí los errores del formulario', validated.error.flatten().fieldErrors);
    }

    const existing = await prisma.profile.findFirst({ select: { id: true } });

    if (existing) {
      await prisma.profile.update({
        where: { id: existing.id },
        data: validated.data,
      });
    } else {
      await prisma.profile.create({ data: validated.data });
    }

    revalidatePath('/');
    revalidatePath('/admin/profile');
    revalidateTag('profile', '');
    return ok();
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return err('No autorizado');
    }
    console.error('[updateProfile]', error);
    return err('Error interno al actualizar el perfil');
  }
}

// ─── READ ────────────────────────────────────────────────────────────────────

async function _getProfile(): Promise<Profile | null> {
  return prisma.profile.findFirst();
}

export const getProfile = unstable_cache(
  _getProfile,
  ['profile'],
  { tags: ['profile'] }
);