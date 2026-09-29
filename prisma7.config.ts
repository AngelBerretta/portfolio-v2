// prisma7.config.ts
// Prisma 7 — config de CLI (migrate, studio, seed).
// Prisma Client en runtime usa su propio adapter (ver src/lib/db.ts).
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // seed: "tsx prisma/seed.ts",   // ← lo activamos en Fase 1, cuando portemos el seed
  },
  datasource: {
    url: env("DIRECT_URL"),   // ← CLI usa la directa
  },
});