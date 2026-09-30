'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import type { ActionResult } from '@/lib/action-types';

export function DeleteButton({
  onDelete,
  confirmMessage = '¿Eliminar este elemento? Esta acción no se puede deshacer.',
  label,
}: {
  onDelete: () => Promise<ActionResult>;
  confirmMessage?: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleClick() {
    if (!window.confirm(confirmMessage)) return;

    setError(null);
    startTransition(async () => {
      const result = await onDelete();
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        title="Eliminar"
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/40 disabled:opacity-50 rounded-lg transition"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        {label}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
