import type { MetadataRoute } from 'next';
import { getAllProjects } from '@/actions/projects';
import { SITE_URL } from '@/lib/site';

/**
 * Solo dos páginas públicas indexables: el home y /partidos. El admin y la
 * API quedan afuera a propósito (ver robots.ts).
 *
 * lastModified sale de la última edición de un proyecto, que es lo que cambia
 * con el tiempo. No se usa `new Date()` porque con cacheComponents leer la
 * hora actual durante el prerender es un error. Si la DB no responde, el
 * sitemap se genera igual, sin fechas.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let lastModified: Date | undefined;

  try {
    const projects = await getAllProjects();
    // unstable_cache serializa a JSON: updatedAt llega como string, no como Date.
    const times = projects
      .map((p) => new Date(p.updatedAt).getTime())
      .filter((t) => Number.isFinite(t));
    if (times.length > 0) lastModified = new Date(Math.max(...times));
  } catch (error) {
    console.error('[sitemap]', error);
  }

  return [
    { url: SITE_URL, lastModified, priority: 1 },
    { url: `${SITE_URL}/partidos`, lastModified, priority: 0.8 },
  ];
}