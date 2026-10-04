'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useScrollState } from '@/hooks/useScrollState';
import { useActiveSection } from '@/hooks/useActiveSection';
import { KitToggle } from '@/components/shared/KitToggle';
import { NavbarMobileMenu } from './NavbarMobileMenu';
import { NAV_LINKS } from './nav-items';

export function Navbar() {
  const pathname = usePathname();
  const { isScrolled } = useScrollState();
  const section = useActiveSection();

  // El scroll spy solo tiene sentido en el home. En otras rutas useActiveSection
  // igual corre (y marcaría "contact" al llegar al final de la página), así que
  // lo ignoramos acá.
  const activeId = pathname === '/' ? section : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Si se agranda la ventana a ≥ md con el menú abierto, lo cerramos
  // (si no, quedaría el scroll del body bloqueado sin menú visible).
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Al cerrar el menú devolvemos el foco al botón hamburguesa.
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !menuOpen) toggleRef.current?.focus();
    wasOpen.current = menuOpen;
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300',
          isScrolled
            ? 'border-border-subtle bg-bg-body/80 backdrop-blur-md'
            : 'border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/#hero"
            aria-label="Angel Berretta — ir al inicio"
            className="font-display text-xl font-bold tracking-tight text-text-primary transition-colors hover:text-accent"
          >
            AB<span className="text-accent">.</span>
          </Link>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((item) => {
                const active = activeId === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      title={item.hint}
                      aria-current={active ? 'location' : undefined}
                      className={cn(
                        'relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                        active
                          ? 'text-accent'
                          : 'text-text-secondary hover:text-text-primary'
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-200',
                          active ? 'scale-x-100' : 'scale-x-0'
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <KitToggle />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-card text-text-primary transition-colors hover:border-accent hover:text-accent md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <NavbarMobileMenu open={menuOpen} onClose={closeMenu} activeId={activeId} />
    </>
  );
}