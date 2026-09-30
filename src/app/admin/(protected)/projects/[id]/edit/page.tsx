import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getProjectById, updateProject } from '@/actions/projects';
import { getAllTags } from '@/actions/tags';
import { ProjectForm } from '@/components/admin/ProjectForm';

export const metadata = { title: 'Admin — Editar proyecto' };

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a proyectos
      </Link>

      <Suspense fallback={<div className="h-96 rounded-xl bg-gray-900 border border-gray-800 animate-pulse" />}>
        <EditProjectContent params={params} />
      </Suspense>
    </div>
  );
}

// Acá viven el await params y las queries: todo queda dentro del Suspense.
async function EditProjectContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, tags] = await Promise.all([getProjectById(id), getAllTags()]);
  if (!project) notFound();

  const action = updateProject.bind(null, id);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-white">Editar proyecto</h1>
        <p className="text-gray-500 text-sm mt-1">{project.title}</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <ProjectForm
          key={project.updatedAt.toISOString()}
          project={project}
          allTags={tags.map((t) => t.name)}
          action={action}
        />
      </div>
    </>
  );
}