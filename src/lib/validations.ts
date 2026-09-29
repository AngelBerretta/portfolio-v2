import { z } from 'zod';

// ─── Proyecto ────────────────────────────────────────────────────────────────

export const ProjectSchema = z
  .object({
    title: z
      .string({ error: 'El título es requerido' })
      .min(1, 'El título es requerido')
      .max(100, 'Máximo 100 caracteres'),

    slug: z
      .string({ error: 'El slug es requerido' })
      .min(1, 'El slug es requerido')
      .max(100, 'Máximo 100 caracteres')
      .regex(
        /^[a-z0-9-]+$/,
        'Solo se permiten minúsculas, números y guiones (-)'
      ),

    description: z
      .string({ error: 'La descripción es requerida' })
      .min(1, 'La descripción es requerida')
      .max(600, 'Máximo 600 caracteres'),

    // Ya no es .min(1) acá — la obligatoriedad condicional se resuelve
    // en el .refine() de abajo, según si hay status o no.
    imageUrl: z.string().optional().default(''),

    codeUrl: z
      .string()
      .min(1, 'La URL del código es requerida')
      .refine(
        (v) => v === '#' || z.url().safeParse(v).success,
        { message: 'Ingresá una URL válida o # si no está disponible' }
      ),

    demoUrl: z
      .string()
      .min(1, 'La URL de la demo es requerida')
      .refine(
        (v) => v === '#' || z.url().safeParse(v).success,
        { message: 'Ingresá una URL válida o # si no está disponible' }
      ),

    category: z.enum(['fullstack', 'frontend', 'landing'], {
      error: 'Seleccioná una categoría',
    }),

    featured: z.boolean().default(false),

    status: z
      .enum(['live', 'in-progress', 'coming-soon'])
      .optional()
      .nullable(),

    statusLabel: z.string().max(30, 'Máximo 30 caracteres').optional().nullable(),

    order: z.coerce.number().int().default(0),

    tags: z
      .array(z.string().min(1))
      .min(1, 'Agregá al menos un tag'),
  })
  .refine((data) => !!data.status || !!data.imageUrl, {
    message: 'La imagen es requerida cuando el proyecto no tiene un estado especial',
    path: ['imageUrl'],
  });

export type ProjectInput = z.infer<typeof ProjectSchema>;

// ─── Skill ───────────────────────────────────────────────────────────────────

export const SkillSchema = z
  .object({
    name: z
      .string({ error: 'El nombre es requerido' })
      .min(1, 'El nombre es requerido')
      .max(50, 'Máximo 50 caracteres')
      .regex(
        /^[a-z0-9.\-\s/]+$/i,
        'Usá un formato tipo paquete npm, ej: "react.js" o "api-rest"'
      ),

    description: z
      .string({ error: 'La descripción es requerida' })
      .min(1, 'La descripción es requerida')
      .max(150, 'Máximo 150 caracteres'),

    level: z.coerce.number().int().min(0).max(100).default(0),

    iconUrl: z
      .url('Ingresá una URL válida')
      .optional()
      .or(z.literal(''))
      .transform((v) => (v === '' ? null : v)),

    iconName: z
      .string()
      .max(50)
      .optional()
      .or(z.literal(''))
      .transform((v) => (v === '' ? null : v)),

    invertIcon: z.boolean().default(false),

    category: z.enum(['frontend', 'backend', 'tools'], {
      error: 'Seleccioná una categoría',
    }),

    order: z.coerce.number().int().default(0),
  })
  .refine((data) => !!data.iconUrl || !!data.iconName, {
    message: 'Completá una URL de ícono o un nombre de ícono Lucide',
    path: ['iconUrl'],
  });

export type SkillInput = z.infer<typeof SkillSchema>;

// ─── Perfil ──────────────────────────────────────────────────────────────────

export const ProfileSchema = z.object({
  bio: z
    .string({ error: 'La bio es requerida' })
    .min(1, 'La bio es requerida')
    .max(1000, 'Máximo 1000 caracteres'),

  avatarUrl: z.string().min(1, 'La foto de perfil es requerida'),

  location: z
    .string({ error: 'La ubicación es requerida' })
    .min(1)
    .max(100),

  education: z
    .string({ error: 'La educación es requerida' })
    .min(1)
    .max(200),

  experience: z
    .string({ error: 'La experiencia es requerida' })
    .min(1)
    .max(200),

  currentFocus: z
    .string({ error: 'El enfoque actual es requerido' })
    .min(1)
    .max(200),

  cvUrl: z.string().optional().nullable(),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;

// ─── Tag ─────────────────────────────────────────────────────────────────────

export const TagSchema = z.object({
  name: z
    .string({ error: 'El nombre del tag es requerido' })
    .min(1, 'El nombre del tag es requerido')
    .max(50, 'Máximo 50 caracteres'),
});

// ─── Reorder ─────────────────────────────────────────────────────────────────

// ─── Contacto (formulario público) ──────────────────────────────────────────
// El honeypot ("company") se chequea aparte en el action, antes de llegar
// a este schema, así que no forma parte de los campos validados acá.

export const ContactSchema = z.object({
  name: z
    .string({ error: 'El nombre es requerido' })
    .min(1, 'El nombre es requerido')
    .max(80, 'Máximo 80 caracteres'),

  email: z
    .string({ error: 'El email es requerido' })
    .min(1, 'El email es requerido')
    .refine((v) => z.email().safeParse(v).success, {
      message: 'Ingresá un email válido',
    }),

  subject: z.string().max(150, 'Máximo 150 caracteres').optional(),

  message: z
    .string({ error: 'El mensaje es requerido' })
    .min(1, 'El mensaje es requerido')
    .max(2000, 'Máximo 2000 caracteres'),
});

export type ContactInput = z.infer<typeof ContactSchema>;

// ─── Reorder ─────────────────────────────────────────────────────────────────

export const ReorderSchema = z.array(
  z.object({
    id: z.string().regex(/^c[a-z0-9]+$/, 'ID inválido'),
    order: z.number().int(),
  })
);