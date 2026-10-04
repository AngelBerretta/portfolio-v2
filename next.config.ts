import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,

  images: {
    // Las imágenes que se suben desde el admin viven en Vercel Blob.
    // Sin esto, next/image rechaza esas URLs. Las rutas locales
    // (/images/*.jpg del seed) no necesitan configuración.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },

  async redirects() {
    return [
      // La ruta vieja del portfolio v1. 308 = permanente (conserva SEO).
      { source: "/proyectos", destination: "/partidos", permanent: true },
    ];
  },
};

export default nextConfig;