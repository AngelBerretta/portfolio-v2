'use server';

import { del } from '@vercel/blob';
import { requireAuth } from '@/lib/require-auth';

/**
 * Borra una imagen del storage de Vercel Blob — se llama cuando el admin
 * reemplaza o quita una imagen, para no dejar archivos huérfanos.
 *
 * Es deliberadamente silenciosa ante errores: si falla el borrado del blob
 * viejo, no queremos que eso rompa el guardado del formulario. Además
 * ignora URLs que no sean de Blob (ej: las rutas estáticas /images/*.jpg
 * que vinieron del seed original), porque no son borrables vía esta API.
 */
export async function deleteBlobImage(url: string): Promise<void> {
  try {
    await requireAuth();

    if (!url || !url.includes('.public.blob.vercel-storage.com')) {
      return;
    }

    await del(url);
  } catch (error) {
    console.error('[deleteBlobImage]', error);
  }
}
