'use client';

import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import Link from 'next/link';
import { ChevronRight, Mail, Shirt, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useKit, type Kit } from '@/context/KitContext';
import type { SectionId } from '@/hooks/useActiveSection';
import { Badge } from '@/components/shared/Badge';
import { GitHubIcon, LinkedInIcon } from '@/components/shared/icons';
import { SOCIAL_LINKS } from '@/components/hero/hero-data';
import { SECTION_ITEMS } from './nav-items';
import './navbar-mobile.css';

interface NavbarMobileMenuProps {
  open: boolean;
  onClose: () => void;
  /** null cuando no estamos en el home (no hay scroll spy fuera de él) */
  activeId: SectionId | null;
}

const KITS: { id: Kit; label: string }[] = [
  { id: 'home', label: 'Local' },
  { id: 'away', label: 'Visitante' },
];

const SOCIAL_ICONS = {
  github: <GitHubIcon className="h-5 w-5" />,
  linkedin: <LinkedInIcon className="h-5 w-5" />,
  email: <Mail size={20} aria-hidden="true" />,
} as const;

// Swipe para cerrar: cuánto hay que mover el dedo para que cuente como
// gesto horizontal, y cuánto para que se cierre al soltar.
const DRAG_START_PX = 10;
const DRAG_CLOSE_PX = 90;

const FOCUSABLE = 'a[href], button:not([disabled])';

const reveal = (i: number) => ({ '--i': i }) as CSSProperties;

export function NavbarMobileMenu({ open, onClose, activeId }: NavbarMobileMenuProps) {
  const { kit, setKit } = useKit();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; dx: number; active: boolean } | null>(
    null
  );

  // Mientras está abierto: Escape cierra, Tab queda atrapado dentro del panel
  // (aria-modal no lo hace solo), el body no scrollea por detrás y el foco
  // se mueve al botón de cerrar.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (!panel.contains(current)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
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

  // ── Swipe hacia la derecha para cerrar (touch / lápiz) ──────────────────
  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'mouse') return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, active: false };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const d = drag.current;
    const panel = panelRef.current;
    if (!d || !panel || d.id !== e.pointerId) return;

    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;

    if (!d.active) {
      // Si el gesto es más vertical que horizontal, es scroll: lo dejamos pasar.
      if (Math.abs(dy) > DRAG_START_PX && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        return;
      }
      if (dx < DRAG_START_PX) return;
      d.active = true;
      panel.setPointerCapture(e.pointerId);
      panel.dataset.dragging = 'true';
    }

    d.dx = Math.max(0, dx);
    panel.style.transform = `translateX(${d.dx}px)`;
  }

  function endDrag(e: ReactPointerEvent<HTMLDivElement>) {
    const d = drag.current;
    const panel = panelRef.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.active || !panel) return;

    delete panel.dataset.dragging;
    panel.style.transform = '';
    if (d.dx > DRAG_CLOSE_PX) onClose();
  }

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

      <div
        ref={panelRef}
        className="nav-mobile__panel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/#hero"
            onClick={onClose}
            aria-label="Angel Berretta — ir al inicio"
            className="font-display text-xl font-bold tracking-tight text-text-primary transition-colors hover:text-accent"
          >
            AB<span className="text-accent">.</span>
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Secciones" className="flex-1">
          <ul className="flex flex-col gap-1">
            {SECTION_ITEMS.map((item, i) => {
              const active = activeId === item.id;
              return (
                <li key={item.id} className="nav-mobile__reveal" style={reveal(i)}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'location' : undefined}
                    className={cn(
                      'group relative flex items-center gap-4 rounded-lg px-3 py-3.5 transition-colors duration-200',
                      active
                        ? 'bg-accent-ghost text-accent'
                        : 'text-text-primary hover:bg-bg-card active:bg-bg-card'
                    )}
                  >
                    {/* Barra lateral: marca la sección donde estás. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-accent transition-transform duration-200',
                        active ? 'scale-y-100' : 'scale-y-0'
                      )}
                    />
                    {/* Mismo número que el eyebrow de cada sección ("01 · Sobre mí"). */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'w-6 shrink-0 font-mono text-xs tabular-nums',
                        active ? 'text-accent' : 'text-text-muted'
                      )}
                    >
                      {String(i).padStart(2, '0')}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="font-display text-lg font-bold leading-tight">
                        {item.label}
                      </span>
                      {item.hint !== item.label && (
                        <span
                          className={cn(
                            'text-sm',
                            active ? 'text-accent/80' : 'text-text-secondary'
                          )}
                        >
                          {item.hint}
                        </span>
                      )}
                    </span>
                    <ChevronRight
                      className={cn(
                        'h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5',
                        active ? 'text-accent' : 'text-text-muted'
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className="nav-mobile__reveal space-y-4 border-t border-border-subtle pt-5"
          style={reveal(SECTION_ITEMS.length)}
        >
          <Badge variant="win" className="px-3 py-1 text-xs">
            <span className="h-2 w-2 rounded-full bg-win motion-safe:animate-pulse" />
            Disponible para trabajar
          </Badge>

          {/* El botón de kit del navbar queda tapado por el panel, así que
              el cambio de camiseta también vive acá. */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-text-muted">
              <Shirt className="h-3.5 w-3.5" aria-hidden="true" />
              Camiseta
            </p>
            <div
              role="group"
              aria-label="Cambiar kit"
              className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-bg-card p-1"
            >
              {KITS.map((k) => {
                const selected = kit === k.id;
                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setKit(k.id)}
                    aria-pressed={selected}
                    className={cn(
                      'h-10 rounded-md text-sm font-medium transition-colors duration-200',
                      selected
                        ? 'bg-accent text-text-inverse'
                        : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {k.label}
                  </button>
                );
              })}
            </div>
          </div>

          <ul className="flex items-center gap-3">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target={s.external ? '_blank' : undefined}
                  rel={s.external ? 'noopener noreferrer' : undefined}
                  aria-label={s.external ? `${s.label} (se abre en una pestaña nueva)` : s.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  {SOCIAL_ICONS[s.id]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}