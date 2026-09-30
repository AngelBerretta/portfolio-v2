import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAllProjects } from '@/actions/projects';
import { ProjectsTable } from '@/components/admin/ProjectsTable';

export const metadata = { title: 'Admin — Proyectos' };

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Proyectos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {projects.length} proyecto{projects.length !== 1 && 's'} en el portfolio.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Nuevo proyecto
        </Link>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}
