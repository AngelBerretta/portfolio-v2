'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ScrollTrigger } from '@/animations/gsap.config';
import { useRevealOnScroll } from '@/animations/useRevealOnScroll';
import { useStatBarFill } from '@/animations/useStatBarFill';

const STATS = [
  { name: 'react.js', level: 90 },
  { name: 'typescript', level: 75 },
  { name: 'node.js', level: 65 },
  { name: 'prisma', level: 50 },
  { name: 'three.js', level: 20 },
];

export function AnimationsTest() {
  const [mounted, setMounted] = useState(true);
  const [triggers, setTriggers] = useState(0);

  // Lectura en vivo de cuántos ScrollTriggers hay registrados.
  useEffect(() => {
    const id = setInterval(() => setTriggers(ScrollTrigger.getAll().length), 300);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-24 px-6 pb-40 pt-6">
      <header className="space-y-4">
        <h1 className="font-display text-3xl font-bold">Prueba de animaciones — fase 5</h1>
        <p className="text-text-secondary">
          Scrolleá hacia abajo. Debería revelarse todo una sola vez.
        </p>

        <Card className="space-y-3">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">Test de memory leaks.</strong> Recargá la
            página SIN scrollear: los triggers activos deberían ser <strong>8</strong> (1 grid +
            2 laterales + 5 barras). Tocá «Desmontar» → debería marcar <strong>0</strong>.
            «Montar» de nuevo → otra vez <strong>8</strong> (no 16). Los triggers son de un solo
            uso, así que el número baja a medida que cada bloque se revela.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setMounted((m) => !m)}>
              {mounted ? 'Desmontar' : 'Montar'}
            </Button>
            <span className="font-mono text-sm tabular-nums">
              Triggers activos: <span className="text-accent">{triggers}</span>
            </span>
          </div>
        </Card>
      </header>

      <div className="h-[70dvh]" aria-hidden="true" />

      {mounted && <RevealDemo />}
    </div>
  );
}

function RevealDemo() {
  const gridRef = useRevealOnScroll({ target: '[data-reveal]', stagger: 0.12 });
  const leftRef = useRevealOnScroll({ direction: 'left' });
  const rightRef = useRevealOnScroll({ direction: 'right' });

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Stagger sobre hijos</h2>
        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} data-reveal>
              <Card className="hover:border-accent">
                <h3 className="font-semibold">Card {i + 1}</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  El hover debe seguir funcionando después de la animación.
                </p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div ref={leftRef}>
          <Card elevated>
            <h3 className="font-semibold">Entra desde la izquierda</h3>
          </Card>
        </div>
        <div ref={rightRef}>
          <Card elevated>
            <h3 className="font-semibold">Entra desde la derecha</h3>
          </Card>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Barras de stat</h2>
        {STATS.map((s, i) => (
          <StatBar key={s.name} {...s} delay={i * 0.08} />
        ))}
      </section>
    </>
  );
}

function StatBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const { barRef, valueRef } = useStatBarFill(level, { delay });

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-mono font-medium text-text-primary">{name}</span>
        <span className="tabular-nums text-text-secondary">
          <span ref={valueRef}>{level}</span>%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-bg-elevated">
        <div
          ref={barRef}
          className="h-full rounded-full bg-accent"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}