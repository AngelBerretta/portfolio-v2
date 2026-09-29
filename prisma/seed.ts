import { config } from "dotenv";
config(); // carga .env (busca en la raíz del proyecto)

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const projectsData = [
  {
    title: 'Fire Market',
    slug: 'fire-market',
    description:
      'E-commerce moderno desarrollado con React y Firebase. Incluye autenticación de usuarios, carrito de compras en tiempo real, gestión de productos con Firestore y una UI fluida con Vite.',
    imageUrl: '/images/firemarket.jpg',
    tags: ['React', 'Firebase', 'Firestore', 'JavaScript', 'Vite'],
    codeUrl: 'https://github.com/AngelBerretta/FireMarket',
    demoUrl: 'https://fire-market-angel.vercel.app/',
    category: 'fullstack',
    featured: true,
    order: 1,
  },
  {
    title: 'E-commerce Dashboard',
    slug: 'ecommerce-dashboard',
    description:
      'Panel de administración moderno para e-commerce. Gestión de productos, análisis de ventas y estadísticas en tiempo real con una interfaz limpia y profesional construida con TypeScript.',
    imageUrl: '/images/dashboard.jpg',
    tags: ['React', 'TypeScript', 'Tailwind'],
    codeUrl: 'https://github.com/AngelBerretta/ForShop',
    demoUrl: 'https://forshop.netlify.app/',
    category: 'fullstack',
    featured: true,
    order: 2,
  },
  {
    title: 'ShopFast',
    slug: 'shopfast',
    description:
      'Tienda online moderna con catálogo dinámico, filtros por categoría y carrito de compras. Consume una API externa para obtener productos y se despliega en Netlify.',
    imageUrl: '/images/shopfast.jpg',
    tags: ['React', 'Vite', 'Tailwind', 'JavaScript', 'API REST'],
    codeUrl: 'https://github.com/AngelBerretta/shop',
    demoUrl: 'https://theshopfast.netlify.app',
    category: 'frontend',
    featured: true,
    order: 3,
  },
  {
    title: 'TerraCart',
    slug: 'terracart',
    description:
      'E-commerce ecológico ficticio con catálogo de productos orgánicos, filtros, carrito persistente con LocalStorage y diseño responsivo. Construido con vanilla JS.',
    imageUrl: '/images/terracart.jpg',
    tags: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'],
    codeUrl: 'https://github.com/AngelBerretta/TerraCart',
    demoUrl: 'https://terracart.netlify.app/',
    category: 'frontend',
    featured: false,
    order: 4,
  },
  {
    title: 'AppWeather',
    slug: 'appweather',
    description:
      'Aplicación del clima moderna y responsive que consume la OpenWeatherMap API. Permite buscar ciudades y visualizar temperatura, humedad y pronóstico extendido.',
    imageUrl: '/images/appweather.jpg',
    tags: ['HTML', 'CSS', 'JavaScript', 'API REST'],
    codeUrl: 'https://github.com/AngelBerretta/appweather',
    demoUrl: 'https://around-weather.netlify.app',
    category: 'frontend',
    featured: false,
    order: 5,
  },
  {
    title: 'CoffeeCraft',
    slug: 'coffeecraft',
    description:
      'Sitio web estático para una cafetería ficticia con menú interactivo, galería de productos y formulario de contacto. Diseño cálido y atractivo con HTML/CSS/JS.',
    imageUrl: '/images/coffeecraft.jpg',
    tags: ['HTML', 'CSS', 'JavaScript'],
    codeUrl: 'https://github.com/AngelBerretta/CoffeeCraft',
    demoUrl: 'https://coffecrafft.netlify.app/',
    category: 'landing',
    featured: false,
    order: 6,
  },
  {
    title: 'Serenity Studio',
    slug: 'serenity-studio',
    description:
      'Landing page elegante y minimalista para un estudio de bienestar. Diseño limpio, animaciones suaves, secciones de servicios y formulario de reserva de sesiones.',
    imageUrl: '/images/serenity.jpg',
    tags: ['HTML', 'CSS', 'JavaScript'],
    codeUrl: 'https://github.com/AngelBerretta/SERENITY-STUDIO',
    demoUrl: 'https://serenityestudio.netlify.app',
    category: 'landing',
    featured: false,
    order: 7,
  },
  {
    title: 'PAWCARE',
    slug: 'pawcare',
    description:
      'Landing page moderna para una clínica veterinaria. Presenta servicios, galería de mascotas, testimonios y un CTA de reserva de turno online con diseño atractivo.',
    imageUrl: '/images/pawcare.jpg',
    tags: ['HTML', 'CSS', 'JavaScript'],
    codeUrl: 'https://github.com/AngelBerretta/PAWCARE',
    demoUrl: 'https://we-pawcare.netlify.app',
    category: 'landing',
    featured: false,
    order: 8,
  },
  {
    title: 'BookWise',
    slug: 'bookwise',
    description:
      'Plataforma e-commerce de libros físicos y e-books con backend completo en Node.js y Express. Incluye autenticación JWT, carrito persistente, gestión de stock, WebSockets para actualizaciones en tiempo real y panel de administración.',
    imageUrl: '/images/bookwise.jpg',
    tags: ['Node.js', 'Express', 'MongoDB', 'React', 'Socket.io', 'JWT'],
    codeUrl: 'https://github.com/AngelBerretta',
    demoUrl: '#',
    category: 'fullstack',
    status: 'in-progress',
    statusLabel: 'En construcción',
    order: 9,
  },
  {
    title: 'PsicoAgenda',
    slug: 'psicoagenda',
    description:
      'Sistema de gestión para psicólogos y pacientes. Permite agendar turnos, gestionar expedientes clínicos, cancelaciones con control de roles y soft delete con bandeja de eliminados. Backend con Prisma y PostgreSQL.',
    imageUrl: '/images/psicoagenda.jpg',
    tags: ['React', 'TypeScript', 'Node.js', 'Prisma', 'PostgreSQL', 'Tailwind'],
    codeUrl: 'https://github.com/AngelBerretta',
    demoUrl: '#',
    category: 'fullstack',
    status: 'in-progress',
    statusLabel: 'En construcción',
    order: 10,
  },
];

async function main() {
  console.log('🌱 Sembrando proyectos...');
  for (const p of projectsData) {
    const { tags, ...projectFields } = p;
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...projectFields,
        tags: {
          connectOrCreate: tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });
  }

  // ─── Skills: ver prisma/reseed-skills.ts ────────────────────────
  // El shape del skillsData viejo (icon, level) no matchea con el schema
  // actual (iconUrl/iconName, invertIcon). Las skills ya están cargadas
  // en la DB. Para resetearlas, correr: npx tsx prisma/reseed-skills.ts
  // ────────────────────────────────────────────────────────────────

  console.log('🌱 Sembrando perfil...');
  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: {
        bio:
          'Desarrollador web Full Stack freelance apasionado por construir experiencias modernas, rápidas y atractivas usando JavaScript / React, con experiencia en Node.js, Firebase y MongoDB.\n\nActualmente curso la Licenciatura en Sistemas de Información en la Universidad Nacional de Luján (UNLu), lo que complementa mi formación técnica autodidacta con una sólida base académica.\n\nSoy proactivo, orientado a resultados, con gran capacidad de aprendizaje y siempre en búsqueda de nuevos desafíos que me permitan crecer profesionalmente.',
        avatarUrl: '/images/avatar.jpg',
        location: 'Chivilcoy, Buenos Aires, Argentina',
        education: 'Lic. en Sistemas de Información — UNLu (En curso)',
        experience: 'Desarrollador Web Freelance (2024 – Actualidad)',
        currentFocus: 'Full Stack — React + Node.js + MongoDB + Firebase',
        cvUrl: '/cv-angel-berretta.pdf',
      },
    });
  }

  console.log('🌱 Sembrando usuario admin...');
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error('Faltan ADMIN_EMAIL o ADMIN_PASSWORD en .env.local');
  }
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash },
  });

  console.log('✅ Seed completo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });