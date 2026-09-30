'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitButton } from './SubmitButton';
import { SKILL_CATEGORIES, AVAILABLE_FALLBACK_ICONS } from '@/lib/constants';
import type { ActionResult } from '@/lib/action-types';
import type { Skill } from '@prisma/client';

export function SkillForm<T = undefined>({
  skill,
  action,
}: {
  skill?: Skill;
  action(
    prevState: ActionResult<T> | null,
    formData: FormData
  ): Promise<ActionResult<T>>;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, null);

  const [name, setName] = useState(skill?.name ?? '');
  const [description, setDescription] = useState(skill?.description ?? '');
  const [category, setCategory] = useState(skill?.category ?? 'frontend');
  const [order, setOrder] = useState(skill?.order ?? 0);

  const [iconType, setIconType] = useState<'url' | 'lucide'>(
    skill?.iconName ? 'lucide' : 'url'
  );
  const [iconUrl, setIconUrl] = useState(skill?.iconUrl ?? '');
  const [iconName, setIconName] = useState(skill?.iconName ?? AVAILABLE_FALLBACK_ICONS[0]);
  const [invertIcon, setInvertIcon] = useState(skill?.invertIcon ?? false);

  const fieldErrors = state?.success === false ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-5">
      {state?.success === false && state.error && (
        <p className="text-sm text-red-400 bg-red-950/50 px-4 py-3 rounded-lg border border-red-900">
          {state.error}
        </p>
      )}

      <Field
        label="Nombre"
        hint='Estilo "paquete npm": minúsculas, ej: "react.js", "api-rest"'
        error={fieldErrors?.name?.[0]}
      >
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
          placeholder="react.js"
        />
      </Field>

      <Field
        label="Descripción"
        hint="Aparece debajo del ícono cuando se 'instala' en la terminal."
        error={fieldErrors?.description?.[0]}
      >
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={2}
          maxLength={150}
          className={inputClass}
          placeholder="Hooks, Context API, React Router y optimización de rendimiento."
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Categoría" error={fieldErrors?.category?.[0]}>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {SKILL_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Orden" hint="Dentro de su categoría (0 = primero).">
          <input
            name="order"
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="space-y-3 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <p className="text-sm font-medium text-gray-300">Ícono</p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIconType('url')}
            className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
              iconType === 'url'
                ? 'bg-blue-600/15 border-blue-600 text-blue-300'
                : 'border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            URL (devicon, etc.)
          </button>
          <button
            type="button"
            onClick={() => setIconType('lucide')}
            className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
              iconType === 'lucide'
                ? 'bg-blue-600/15 border-blue-600 text-blue-300'
                : 'border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            Ícono Lucide (sin logo)
          </button>
        </div>

        {iconType === 'url' ? (
          <Field
            label="URL del ícono"
            hint={
              <>
                Para tecnologías con logo, usá{' '}
                <a
                  href="https://devicon.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  devicon.dev
                </a>{' '}
                — buscá el nombre y copiá el link del SVG.
              </>
            }
            error={fieldErrors?.iconUrl?.[0]}
          >
            <input
              name="iconUrl"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              className={inputClass}
              placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
            />
            <input type="hidden" name="iconName" value="" />
          </Field>
        ) : (
          <Field
            label="Nombre de ícono Lucide"
            hint={`Para conceptos sin logo (ej: "API REST"). Disponibles ahora mismo: ${AVAILABLE_FALLBACK_ICONS.join(', ')}. Otro nombre requiere agregarlo también en components/skills/SkillIcon.tsx.`}
          >
            <select
              name="iconName"
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              className={inputClass}
            >
              {AVAILABLE_FALLBACK_ICONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <input type="hidden" name="iconUrl" value="" />
          </Field>
        )}

        {iconType === 'url' && (
          <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={invertIcon}
              onChange={(e) => setInvertIcon(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
            />
            <input type="hidden" name="invertIcon" value={invertIcon ? 'true' : 'false'} />
            <span className="text-sm text-gray-400">
              Invertir color (para logos oscuros/negros, ej: Next.js, Express, Vercel)
            </span>
          </label>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{skill ? 'Guardar cambios' : 'Crear tecnología'}</SubmitButton>
        <button
          type="button"
          onClick={() => router.push('/admin/skills')}
          className="px-5 py-2.5 text-gray-400 hover:text-white text-sm font-medium transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

const inputClass =
  'w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}