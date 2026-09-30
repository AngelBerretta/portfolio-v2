'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { SubmitButton } from './SubmitButton';
import { ImageUploader } from './ImageUploader';
import type { ActionResult } from '@/lib/action-types';
import type { Profile } from '@prisma/client';

export function ProfileForm({
  profile,
  action,
}: {
  profile: Profile | null;
  action: (prevState: ActionResult | null, formData: FormData) => Promise<ActionResult>;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
      const timeout = setTimeout(() => setDismissed(true), 2500);
      return () => clearTimeout(timeout);
    }
  }, [state, router]);

  const fieldErrors = state?.success === false ? state.fieldErrors : undefined;
  const showSaved = state?.success === true && !dismissed;

  return (
    <form action={formAction} onSubmit={() => setDismissed(false)} className="space-y-6">
      {state?.success === false && state.error && (
        <p className="text-sm text-red-400 bg-red-950/50 px-4 py-3 rounded-lg border border-red-900">
          {state.error}
        </p>
      )}

      {showSaved && (
        <p className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-950/40 px-4 py-3 rounded-lg border border-emerald-900">
          <CheckCircle2 className="w-4 h-4" />
          Perfil actualizado. Los cambios ya están en el sitio público.
        </p>
      )}

      <Field label="Foto de perfil" error={fieldErrors?.avatarUrl?.[0]}>
        <ImageUploader name="avatarUrl" initialUrl={profile?.avatarUrl} folder="profile" aspectRatio="aspect-square" />
      </Field>

      <Field label="Bio" error={fieldErrors?.bio?.[0]}>
        <textarea
          name="bio"
          defaultValue={profile?.bio}
          required
          rows={6}
          className={inputClass}
          placeholder="Contá quién sos, qué hacés y qué te apasiona..."
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Ubicación" error={fieldErrors?.location?.[0]}>
          <input
            name="location"
            defaultValue={profile?.location}
            required
            className={inputClass}
            placeholder="Chivilcoy, Buenos Aires, Argentina"
          />
        </Field>

        <Field label="Enfoque actual" error={fieldErrors?.currentFocus?.[0]}>
          <input
            name="currentFocus"
            defaultValue={profile?.currentFocus}
            required
            className={inputClass}
            placeholder="Full Stack — React + Node.js"
          />
        </Field>

        <Field label="Educación" error={fieldErrors?.education?.[0]}>
          <input
            name="education"
            defaultValue={profile?.education}
            required
            className={inputClass}
            placeholder="Lic. en Sistemas — UNLu (En curso)"
          />
        </Field>

        <Field label="Experiencia" error={fieldErrors?.experience?.[0]}>
          <input
            name="experience"
            defaultValue={profile?.experience}
            required
            className={inputClass}
            placeholder="Desarrollador Freelance (2024 – Actualidad)"
          />
        </Field>
      </div>

      <Field label="URL del CV (opcional)" error={fieldErrors?.cvUrl?.[0]}>
        <input
          name="cvUrl"
          defaultValue={profile?.cvUrl ?? ''}
          className={inputClass}
          placeholder="/cv-mi-nombre.pdf"
        />
      </Field>

      <div className="pt-2">
        <SubmitButton>Guardar cambios</SubmitButton>
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
  hint?: string;
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
