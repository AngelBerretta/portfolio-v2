import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil } from 'lucide-react';
import { getAllSkills, deleteSkill } from '@/actions/skills';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { SKILL_CATEGORIES } from '@/lib/constants';

export const metadata = { title: 'Admin — Tecnologías' };

export default async function SkillsPage() {
  const skills = await getAllSkills();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tecnologías</h1>
          <p className="text-gray-500 text-sm mt-1">
            {skills.length} skill{skills.length !== 1 && 's'} mostradas en la terminal del portfolio.
          </p>
        </div>
        <Link
          href="/admin/skills/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Nueva tecnología
        </Link>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
          <p className="text-gray-400">Todavía no agregaste ninguna tecnología.</p>
          <Link
            href="/admin/skills/new"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition"
          >
            + Agregar la primera
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {SKILL_CATEGORIES.map(({ value: category, label }) => {
            const categorySkills = skills.filter((s) => s.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <div key={category} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-800 bg-gray-900/50">
                  <h2 className="text-sm font-semibold text-gray-300">{label}</h2>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {categorySkills.map((skill) => (
                      <tr
                        key={skill.id}
                        className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition"
                      >
                        <td className="px-5 py-3 w-12">
                          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                            {skill.iconUrl ? (
                              <Image
                                src={skill.iconUrl}
                                alt=""
                                width={20}
                                height={20}
                                unoptimized
                                className={skill.invertIcon ? 'invert' : ''}
                              />
                            ) : (
                              <span className="text-[9px] text-gray-500 font-mono">
                                {skill.iconName?.slice(0, 3)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-white font-medium font-mono">{skill.name}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                          {skill.description}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/skills/${skill.id}/edit`}
                              prefetch={false}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <DeleteButton
                              onDelete={deleteSkill.bind(null, skill.id)}
                              confirmMessage={`¿Eliminar "${skill.name}"?`}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
