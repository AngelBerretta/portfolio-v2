'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, ArrowDown, Pencil, Star } from 'lucide-react';
import { DeleteButton } from './DeleteButton';
import { deleteProject, reorderProjects } from '@/actions/projects';
import type { Project, Tag } from '@prisma/client';

type ProjectWithTags = Project & { tags: Tag[] };

const CATEGORY_LABELS: Record<string, string> = {
  fullstack: 'Full Stack',
  frontend: 'Frontend',
  landing: 'Landing',
};

export function ProjectsTable({ projects: initial }: { projects: ProjectWithTags[] }) {
  const [projects, setProjects] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setProjects(initial);
  }, [initial]);

  function move(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setProjects(reordered);

    const payload = reordered.map((p, i) => ({ id: p.id, order: i }));

    startTransition(async () => {
      const result = await reorderProjects(JSON.stringify(payload));
      if (!result.success) {
        // revertir en caso de error
        setProjects(initial);
      }
      router.refresh();
    });
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
        <p className="text-gray-400">Todavía no creaste ningún proyecto.</p>
        <Link
          href="/admin/projects/new"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition"
        >
          + Crear el primero
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-left text-gray-500">
            <th className="px-4 py-3 font-medium w-16"></th>
            <th className="px-4 py-3 font-medium">Proyecto</th>
            <th className="px-4 py-3 font-medium">Categoría</th>
            <th className="px-4 py-3 font-medium">Tags</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr
              key={project.id}
              className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition"
            >
              <td className="px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={index === 0 || isPending}
                    onClick={() => move(index, -1)}
                    className="text-gray-600 hover:text-white disabled:opacity-20 disabled:hover:text-gray-600 transition"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === projects.length - 1 || isPending}
                    onClick={() => move(index, 1)}
                    className="text-gray-600 hover:text-white disabled:opacity-20 disabled:hover:text-gray-600 transition"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                    {project.imageUrl && (
                      <Image
                        src={project.imageUrl}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-white font-medium truncate">{project.title}</p>
                      {project.featured && (
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-500 text-xs truncate">/{project.slug}</p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-3 text-gray-400">
                {CATEGORY_LABELS[project.category] ?? project.category}
              </td>

              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1 max-w-[220px]">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="px-1.5 py-0.5 bg-gray-800 text-gray-400 text-xs rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-1.5 py-0.5 text-gray-600 text-xs">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </td>

              <td className="px-4 py-3">
                {project.status ? (
                  <span className="px-2 py-1 bg-orange-950/50 text-orange-400 text-xs rounded-md border border-orange-900/50">
                    {project.statusLabel ?? project.status}
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-emerald-950/50 text-emerald-400 text-xs rounded-md border border-emerald-900/50">
                    Live
                  </span>
                )}
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    prefetch={false}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <DeleteButton
                    onDelete={() => deleteProject(project.id)}
                    confirmMessage={`¿Eliminar "${project.title}"? Esta acción no se puede deshacer.`}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
