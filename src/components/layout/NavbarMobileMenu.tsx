'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SectionId } from '@/hooks/useActiveSection';
import { SECTION_ITEMS } from './nav-items';
import './navbar-mobile.css';

interface NavbarMobileMenuProps {
  open: boolean;
  onClose: () => void;
  /** null cuando no estamos en el home (no hay scroll spy fuera de él) */
  activeId: SectionId | null;
}

export function NavbarMobileMenu({ open, onClose, activeId }: NavbarMobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Mientras está abierto: Escape cierra, el body no scrollea por detrás
  // y el foco se mueve al botón de cerrar.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      className="nav-mobile md:hidden"
      data-open={open}
      // inert saca del tab order y del árbol de accesibilidad todo lo que
      // hay adentro mientras el menú está cerrado.
      inert={!open}
    >
      <div className="nav-mobile__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="nav-mobile__panel">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-text-primary">Menú</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Secciones">
          <ul className="flex flex-col gap-1">
            {SECTION_ITEMS.map((item) => {
              const active = activeId === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'location' : undefined}
                    className={cn(
                      'flex flex-col rounded-lg border px-4 py-3 transition-colors duration-200',
                      active
                        ? 'border-accent/30 bg-accent-ghost text-accent'
                        : 'border-transparent text-text-primary hover:bg-bg-card'
                    )}
                  >
                    <span className="text-base font-medium">{item.label}</span>
                    {item.hint !== item.label && (
                      <span className="text-sm text-text-secondary">{item.hint}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}