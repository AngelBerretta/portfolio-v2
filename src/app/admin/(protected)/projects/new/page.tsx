import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createProject } from '@/actions/projects';
import { getAllTags } from '@/actions/tags';
import { ProjectForm } from '@/components/admin/ProjectForm';

export const metadata = { title: 'Admin — Nuevo proyecto' };

export default function NewProjectPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a proyectos
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white">Nuevo proyecto</h1>
        <p className="text-gray-500 text-sm mt-1">
          Se va a mostrar en el sitio público apenas lo guardes.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gray-800/50" />}>
          <NewProjectForm />
        </Suspense>
      </div>
    </div>
  );
}

// La query de tags vive acá, dentro del Suspense.
async function NewProjectForm() {
  const tags = await getAllTags();

  return (
    <ProjectForm
      allTags={tags.map((t) => t.name)}
      action={createProject}
    />
  );
}