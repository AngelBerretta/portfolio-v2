import type { Metadata } from 'next';

// Única fuente de verdad del SEO: layout, páginas, robots, sitemap y la imagen
// Open Graph salen de acá.

// URL canónica del sitio. Prioridad:
//   1. NEXT_PUBLIC_SITE_URL (definila en Vercel cuando tengas dominio propio)
//   2. VERCEL_PROJECT_PRODUCTION_URL (la inyecta Vercel sola, sin https://)
//   3. localhost en desarrollo
// A propósito NO hay un dominio hardcodeado de respaldo: el del portfolio v1
// haría que los canonical y el sitemap de este sitio apunten al sitio viejo.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = 'Angel Berretta';
export const SITE_TITLE = 'Angel Berretta — Full Stack Developer';
export const SITE_DESCRIPTION =
  'Portfolio de Angel Berretta, Desarrollador Full Stack Freelance. Especializado en React, Node.js, Firebase y más.';

// La imagen la genera app/opengraph-image.tsx (ruta /opengraph-image).
export const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: SITE_TITLE,
};

/**
 * Open Graph completo para una página. Next reemplaza `openGraph` entero (no
 * lo fusiona campo a campo) cuando una página define el suyo, así que cada
 * página que lo personalice debe pasar por acá para no perder siteName,
 * locale o la imagen.
 */
export function buildOpenGraph({
  title,
  description,
  path = '/',
}: {
  title: string;
  description: string;
  path?: string;
}): NonNullable<Metadata['openGraph']> {
  return {
    type: 'website',
    locale: 'es_AR',
    siteName: SITE_NAME,
    url: path,
    title,
    description,
    images: [OG_IMAGE],
  };
}