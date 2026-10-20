<div align="center">

# ⚽ Angel Berretta — Portfolio v2

**Portfolio full stack con temática de fútbol: carta de jugador, cancha de tecnologías, partidos (proyectos) y un panel de administración propio.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

[Demo en vivo](https://portfolio-fullstack-angelberretta.vercel.app/) · [Reportar un problema](https://github.com/AngelBerretta/portfolio-v2/issues) · [Contacto](#-contacto)

</div>


![Vista previa](./public/screenshots/home.png)


---

## 📑 Tabla de contenidos

- [Concepto](#-concepto)
- [Características](#-características)
- [Stack tecnológico](#-stack-tecnológico)
- [Decisiones de arquitectura](#-decisiones-de-arquitectura)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Primeros pasos](#-primeros-pasos)
- [Variables de entorno](#-variables-de-entorno)
- [Scripts disponibles](#-scripts-disponibles)
- [Panel de administración](#-panel-de-administración)
- [Personalización](#-personalización)
- [Despliegue](#-despliegue)
- [Contacto](#-contacto)

---

## 🎯 Concepto

Cada sección del portfolio es una metáfora futbolera, pero **el significado siempre está en lenguaje llano** (textos, `title` y etiquetas accesibles) para que un reclutador lo entienda de un vistazo.

| Sección | Nombre en el menú | Qué es realmente |
| --- | --- | --- |
| Hero | **Inicio** | Presentación, rol animado, estadísticas y balón 3D |
| About | **Sobre mí** | Bio y carta de jugador estilo FIFA |
| Skills | **Plantel** | Tecnologías dispuestas en una cancha: Frontend vs Backend, y las herramientas en el banco |
| Projects | **Partidos** | Proyectos: los «titulares» están online, los «suplentes» en construcción |
| Contact | **Fichaje** | Formulario de contacto y datos de disponibilidad |

Además, el sitio tiene dos **kits** (camisetas): **Visitante** (oscuro con acento lima) y **Local** (verde bosque), intercambiables en caliente y persistidos sin parpadeo.

---

## ✨ Características

### Sitio público
- 🎨 **Dos temas (kits)** basados en design tokens de Tailwind 4, con script anti-flash previo a la hidratación.
- ⚽ **Balón 3D procedural** (three.js + React Three Fiber) generado por código, sin descargar modelos ni texturas. Se carga solo cuando es visible, el navegador está ocioso y el dispositivo lo soporta; en caso contrario cae a un balón SVG 2D.
- 🃏 **Carta de jugador dinámica**: los atributos (Frontend, Backend, UI/UX, Bases de datos) se **calculan a partir de los proyectos** cargados en la base de datos.
- 🏟️ **Cancha de tecnologías interactiva** con formación automática (4-3-3, que se adapta a la cantidad de skills), ficha del jugador y banco de suplentes.
- 🗂️ **Proyectos** con filtro por categoría, tags expandibles y estados (online / en construcción / próximamente).
- 📬 **Formulario de contacto** 100 % server-side con Resend, rate limiting y honeypot anti-bots.
- 🧭 **Navegación completa**: navbar, menú mobile con swipe para cerrar y focus trap, side-nav, migas de pan, barra de progreso de scroll y botón «volver arriba».
- 🔎 **SEO**: metadata por página, Open Graph generado dinámicamente, `sitemap.xml`, `robots.txt` y datos estructurados JSON-LD (`schema.org/Person`).
- ♿ **Accesibilidad**: contraste WCAG AA verificado, skip link, `prefers-reduced-motion`, `inert`, `aria-*` y etiquetas accesibles.

### Panel de administración
- 🔐 Autenticación con credenciales (Auth.js v5) y rutas protegidas.
- 📁 CRUD de **proyectos** con reordenamiento (actualización optimista), selector de tags y subida de imágenes.
- 🧩 CRUD de **tecnologías** (ícono por URL de Devicon o ícono Lucide, color invertible, nivel y orden).
- 👤 Edición del **perfil** (bio, foto, ubicación, educación, experiencia, CV).
- 🖼️ **Subida de imágenes a Vercel Blob** con compresión previa en el navegador y borrado automático de archivos huérfanos.
- 📊 Dashboard con métricas generales.

---

## 🛠️ Stack tecnológico

| Área | Tecnologías |
| --- | --- |
| **Framework** | Next.js 16 (App Router, Server Components, Server Actions), React 19 |
| **Lenguaje** | TypeScript 5 (modo estricto) |
| **Estilos** | Tailwind CSS 4, `clsx` + `tailwind-merge` |
| **Base de datos** | PostgreSQL + Prisma 7 (`@prisma/adapter-pg`) |
| **Autenticación** | Auth.js (NextAuth v5) con Credentials + `bcryptjs` |
| **Validación** | Zod 4 |
| **Animaciones** | Web Animations API + IntersectionObserver, GSAP + ScrollTrigger |
| **3D** | three.js + React Three Fiber |
| **Email** | Resend |
| **Almacenamiento** | Vercel Blob |
| **Íconos** | Lucide React |
| **Calidad** | ESLint 9 (`eslint-config-next`) |
| **Hosting** | Vercel |

---

## 🧠 Decisiones de arquitectura

<details>
<summary><strong>Rendimiento y carga de datos</strong></summary>

- **Streaming con `<Suspense>`**: el home renderiza el hero y cada sección con su propio skeleton, de modo que el HTML inicial llega rápido y los datos se resuelven en paralelo.
- **Caché con etiquetas**: las lecturas (`getAllProjects`, `getAllSkills`, `getProfile`, …) usan `unstable_cache` con tags, y cada mutación invalida con `updateTag` + `revalidatePath`.
- **Un único listener de scroll**: `ScrollProvider` centraliza el scroll en un solo listener + `requestAnimationFrame` y solo actualiza el estado cuando un booleano cambia, evitando re-renders a 60 fps.
- **Scroll spy sin listeners**: `useSectionSpy` usa `IntersectionObserver` (banda de detección + footer) y un `MutationObserver` para las secciones que llegan por streaming.
- **Hero con islas cliente mínimas**: el `h1`, el texto y los CTAs se renderizan en el servidor; solo `TypedRole` y `BallStage` son cliente. La entrada animada es CSS puro.
- **Glow sin blur**: los resplandores usan `radial-gradient` en lugar de `blur-3xl` para no cargar la GPU.
- **Imágenes optimizadas**: `next/image` con `remotePatterns` para Vercel Blob y compresión en el cliente antes de subir.
- **CSS inline** (`experimental.inlineCss`) para reducir requests bloqueantes.

</details>

<details>
<summary><strong>Balón 3D</strong></summary>

- El patrón del balón (icosaedro truncado: 12 pentágonos + 20 hexágonos) se genera **proceduralmente** en un buffer RGBA y se convierte en textura: cero assets.
- Carga diferida en cadena: visible (`IntersectionObserver`) → página cargada y navegador ocioso → dispositivo capaz (`WebGL`, memoria, «Ahorro de datos»).
- El render se **pausa fuera de pantalla** y una guardia de rendimiento baja la resolución si los FPS caen.
- Si el 3D falla o tarda más de 3 s, se muestra el balón SVG 2D de respaldo. Un *error boundary* evita que un fallo de WebGL tumbe el hero.

</details>

<details>
<summary><strong>Seguridad</strong></summary>

- **Defensa en profundidad**: el middleware (`proxy.ts`) protege `/admin`, el layout `(protected)` revalida la sesión y **cada Server Action** llama a `requireAuth()`.
- **Rate limiting** en login y contacto, respaldado en la tabla `LoginAttempt` (ventana de 15 min, 5 intentos) con limpieza automática de registros viejos.
- **Honeypot** en el formulario de contacto y **escape de HTML** en los correos.
- **Tokens de subida** de Vercel Blob solo para sesiones admin, con tipos y tamaño máximo restringidos.
- **Validación con Zod** en el servidor para todos los formularios; la API key de Resend nunca sale del servidor.
- El panel `/admin` está excluido de buscadores (`robots` + `noindex`).

</details>

<details>
<summary><strong>Accesibilidad y movimiento</strong></summary>

- Los tokens de color cumplen **WCAG AA** (texto ≥ 4.5:1, controles ≥ 3:1) en ambos kits.
- `prefers-reduced-motion` se respeta tanto en CSS (red de seguridad global) como en JS (hooks de animación y `gsap.matchMedia`).
- Menú mobile con `role="dialog"`, focus trap, cierre con `Esc`, `inert` y devolución del foco.
- Etiquetas accesibles coherentes con el texto visible (WCAG 2.5.3).

</details>

---

## 📂 Estructura del proyecto

```text
portfolio-v2/
├── prisma/
│   ├── migrations/            # Migraciones SQL
│   ├── schema.prisma          # Modelos: Project, Tag, Skill, Profile, AdminUser, LoginAttempt
│   └── seed.ts                # Datos iniciales (proyectos, perfil y usuario admin)
├── src/
│   ├── actions/               # Server Actions (auth, contact, profile, projects, skills, tags, upload)
│   ├── animations/            # GSAP config, useRevealOnScroll, useStatBarFill
│   ├── app/
│   │   ├── (site)/            # Sitio público: home y /partidos
│   │   ├── admin/             # Panel: login y rutas protegidas
│   │   ├── api/               # Auth.js y token de subida a Blob
│   │   ├── opengraph-image.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── about/             # Sobre mí + carta de jugador
│   │   ├── admin/             # Formularios, tablas y sidebar del panel
│   │   ├── hero/              # Hero, balón 3D/2D, HUD de estadísticas
│   │   ├── layout/            # Navbar, SideNav, Breadcrumb, ScrollProgress…
│   │   ├── matches/           # Proyectos («Partidos»)
│   │   ├── shared/            # UI reutilizable (Button, Card, Badge, Reveal…)
│   │   ├── squad/             # Cancha de tecnologías («Plantel»)
│   │   └── transfer/          # Contacto («Fichaje»)
│   ├── context/               # KitContext (tema) y ScrollContext
│   ├── hooks/                 # useSectionSpy, useTypewriter, usePrefersReducedMotion…
│   ├── lib/                   # db, validaciones, rate-limit, SEO, constantes
│   ├── three/                 # Balón 3D procedural y detección de capacidades
│   ├── auth.ts / auth.config.ts
│   └── proxy.ts               # Protección de /admin
├── next.config.ts
├── prisma7.config.ts
└── package.json
```

---

## 🚀 Primeros pasos

### Requisitos

- **Node.js** 20.9 o superior
- **npm** (o pnpm / yarn)
- Una base de datos **PostgreSQL** (local o en la nube: Neon, Supabase, Vercel Postgres…)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/AngelBerretta/portfolio-v2.git
cd portfolio-v2

# 2. Instalar dependencias (también ejecuta `prisma generate`)
npm install

# 3. Configurar las variables de entorno
cp .env.example .env   # o crea el archivo .env a mano (ver sección siguiente)
```

### Base de datos

> El archivo de configuración de Prisma se llama `prisma7.config.ts`, por lo que hay que indicarlo con `--config` al usar la CLI.

```bash
# Aplicar las migraciones
npx prisma migrate deploy --config prisma7.config.ts

# Cargar los datos iniciales (proyectos, perfil y usuario administrador)
npx tsx prisma/seed.ts
```

El seed es idempotente: usa `upsert` para los proyectos y el administrador, y solo crea el perfil si todavía no existe. Las **tecnologías (skills)** se cargan desde el panel de administración.

### Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## 🔑 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (ya está ignorado por Git):

```bash
# ── Base de datos ─────────────────────────────────────────────
DATABASE_URL="postgresql://usuario:password@host:5432/db"   # conexión de la app (pooling)
DIRECT_URL="postgresql://usuario:password@host:5432/db"     # conexión directa para migraciones

# ── Auth.js ───────────────────────────────────────────────────
AUTH_SECRET="..."                  # genéralo con: npx auth secret   (o: openssl rand -base64 32)

# ── Usuario administrador (solo lo usa el seed) ───────────────
ADMIN_EMAIL="admin@ejemplo.com"
ADMIN_PASSWORD="una-contraseña-segura"

# ── Email (formulario de contacto) ────────────────────────────
RESEND_API_KEY="re_..."
CONTACT_TO_EMAIL="tu@email.com"    # opcional: destino de los mensajes

# ── Subida de imágenes ────────────────────────────────────────
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# ── SEO ───────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL="https://tu-dominio.com"   # opcional; en Vercel se infiere solo
```

| Variable | Obligatoria | Descripción |
| --- | :---: | --- |
| `DATABASE_URL` | ✅ | Conexión usada por la aplicación en runtime |
| `DIRECT_URL` | ✅ | Conexión directa usada por Prisma para migraciones |
| `AUTH_SECRET` | ✅ | Secreto para firmar las sesiones JWT |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | ✅ (seed) | Credenciales del usuario administrador inicial |
| `RESEND_API_KEY` | ✅ | API key de Resend para enviar los mensajes de contacto |
| `CONTACT_TO_EMAIL` | ➖ | Destinatario de los mensajes (por defecto, el email del autor) |
| `BLOB_READ_WRITE_TOKEN` | ✅ | Token de Vercel Blob para subir imágenes desde el admin |
| `NEXT_PUBLIC_SITE_URL` | ➖ | URL canónica. Si falta, usa `VERCEL_PROJECT_PRODUCTION_URL` o `localhost` |

> **Nota sobre Resend:** mientras uses el remitente `onboarding@resend.dev`, solo se pueden entregar correos a la dirección de tu propia cuenta de Resend. Para enviar a otros destinatarios, verifica un dominio propio y actualiza el campo `from` en `src/actions/contact.ts`.

---

## 📜 Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción |
| `npm run start` | Sirve la build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npx tsx prisma/seed.ts` | Carga los datos iniciales |
| `npx prisma migrate dev --config prisma7.config.ts` | Crea y aplica una migración en desarrollo |
| `npx prisma migrate deploy --config prisma7.config.ts` | Aplica migraciones pendientes (producción) |

> `postinstall` ejecuta `prisma generate` automáticamente.

---

## 🔒 Panel de administración

El panel vive en `/admin`. No hay enlace destacado: el acceso discreto es el punto (`·`) del footer del sitio, o ir directamente a `/admin/login`.

| Ruta | Función |
| --- | --- |
| `/admin/login` | Inicio de sesión (con límite de intentos fallidos) |
| `/admin/dashboard` | Resumen: proyectos, destacados, en construcción y tecnologías |
| `/admin/projects` | Listado, reordenamiento, edición y eliminación de proyectos |
| `/admin/projects/new` · `/[id]/edit` | Alta y edición de proyectos |
| `/admin/skills` | Listado de tecnologías agrupadas por categoría |
| `/admin/skills/new` · `/[id]/edit` | Alta y edición de tecnologías |
| `/admin/profile` | Perfil público («Sobre mí») |

Todos los cambios se reflejan en el sitio público al instante gracias a la invalidación de caché por tags.

---

## 🧩 Personalización

La mayor parte del contenido editable está concentrada en pocos archivos:

| Qué cambiar | Dónde |
| --- | --- |
| Roles del typewriter, redes sociales y estadísticas por defecto | `src/components/hero/hero-data.ts` |
| Datos de contacto, horarios y tiempo de respuesta | `src/components/transfer/transfer-data.ts` |
| Nombre, posición y atributos manuales de la carta de jugador | `src/components/about/player-data.ts` |
| Qué proyectos suman a cada atributo calculado | `src/components/about/player-stats.ts` |
| Nombres de las secciones del menú | `src/components/layout/nav-items.ts` |
| Colores, kits y design tokens | `src/app/globals.css` |
| Metadatos SEO globales | `src/lib/site.ts` |
| Categorías de proyectos y skills | `src/lib/constants.ts` |

> 🧪 La ruta `/animations-test` es una página temporal para validar las animaciones; **devuelve 404 en producción** y puede eliminarse cuando ya no haga falta.

---

## ☁️ Despliegue

El proyecto está pensado para desplegarse en **[Vercel](https://vercel.com)**:

1. Importa el repositorio en Vercel.
2. Configura las [variables de entorno](#-variables-de-entorno) en el proyecto.
3. Crea un **Blob store** y vincúlalo al proyecto (genera `BLOB_READ_WRITE_TOKEN`).
4. Aplica las migraciones a la base de producción: `npx prisma migrate deploy --config prisma7.config.ts`.
5. Ejecuta el seed una vez para crear el usuario administrador y los datos iniciales.
6. Despliega. 🎉

---

## 📬 Contacto

**Angel Berretta** — Full Stack Developer · Buenos Aires, Argentina 🇦🇷

[![GitHub](https://img.shields.io/badge/GitHub-AngelBerretta-181717?logo=github&logoColor=white)](https://github.com/AngelBerretta)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-angelberretta-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/angelberretta)
[![Email](https://img.shields.io/badge/Email-angelberretta.dev@gmail.com-EA4335?logo=gmail&logoColor=white)](mailto:angelberretta.dev@gmail.com)

---

<div align="center">

Hecho con ❤️ por [Angel Berretta](https://github.com/AngelBerretta)

</div>