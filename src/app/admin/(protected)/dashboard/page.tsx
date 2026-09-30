import Link from 'next/link';
import { FolderKanban, Sparkles, Star, Construction } from 'lucide-react';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export const instant = false;

async function getStats() {
  const [totalProjects, featuredProjects, inProgressProjects, totalSkills, totalTags] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { featured: true } }),
      prisma.project.count({ where: { status: { not: null } } }),
      prisma.skill.count(),
      prisma.tag.count(),
    ]);

  return { totalProjects, featuredProjects, inProgressProjects, totalSkills, totalTags };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getStats();

  const cards = [
    {
      label: 'Proyectos publicados',
      value: stats.totalProjects,
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'text-blue-400',
    },
    {
      label: 'Proyectos destacados',
      value: stats.featuredProjects,
      icon: Star,
      href: '/admin/projects',
      color: 'text-yellow-400',
    },
    {
      label: 'En construcción',
      value: stats.inProgressProjects,
      icon: Construction,
      href: '/admin/projects',
      color: 'text-orange-400',
    },
    {
      label: 'Tecnologías',
      value: stats.totalSkills,
      icon: Sparkles,
      href: '/admin/skills',
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Hola, {session?.user?.email?.split('@')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Resumen general del portfolio.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition group"
          >
            <card.icon className={`w-5 h-5 ${card.color} mb-3`} />
            <p className="text-2xl font-bold text-white group-hover:text-blue-400 transition">
              {card.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Accesos rápidos</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition"
          >
            + Nuevo proyecto
          </Link>
          <Link
            href="/admin/skills/new"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition"
          >
            + Nueva tecnología
          </Link>
          <Link
            href="/admin/profile"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition"
          >
            Editar perfil
          </Link>
        </div>
      </div>
    </div>
  );
}