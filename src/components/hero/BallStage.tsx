'use client';

import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/utils/cn';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { canRender3D, whenIdleAfterLoad } from '@/three/capabilities';
import { BallFallback } from './BallFallback';

// ssr: false → three no se evalúa en el servidor. Y como BallScene es el
// único importador de three en el hero, queda en un chunk separado.
const BallScene = dynamic(() => import('./BallScene'), { ssr: false });

/** Si WebGL o el chunk fallan, el error no debe tumbar todo el hero. */
class BallErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Muestra SIEMPRE el balón 2D primero (viene en el HTML del servidor, no hay
 * layout shift ni espera). El 3D se carga recién cuando se cumplen TODAS estas
 * condiciones, en este orden:
 *   1. el balón entró en pantalla (IntersectionObserver). Si está oculto con
 *      display:none (mobile) nunca "entra", así que three.js no se descarga;
 *   2. la página terminó de cargar y el navegador está ocioso;
 *   3. el dispositivo lo aguanta (WebGL, memoria, sin "ahorro de datos").
 * Se queda en 2D con prefers-reduced-motion o ante cualquier error. La textura
 * y la geometría se crean al montar BallScene, o sea, solo después de todo esto.
 */
export function BallStage({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);
  const [idle, setIdle] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // 1. Esperar a que el balón sea visible. Una sola vez: después, BallScene
  //    pausa su propio render cuando sale de pantalla.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2 y 3. Ya visible: esperar a que el navegador esté libre.
  useEffect(() => {
    if (!inView || reducedMotion || failed || !canRender3D()) return;
    return whenIdleAfterLoad(() => setIdle(true));
  }, [inView, reducedMotion, failed]);

  const show3D = idle && !reducedMotion && !failed;
  const threeVisible = show3D && ready;

  return (
    <div ref={rootRef} className={cn('relative', className)} aria-hidden="true">
      <BallFallback
        className={cn(
          'absolute inset-0 h-full w-full transition-opacity duration-500',
          threeVisible && 'opacity-0'
        )}
      />

      {show3D && (
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            ready ? 'opacity-100' : 'opacity-0'
          )}
        >
          <BallErrorBoundary onError={() => setFailed(true)}>
            <BallScene onReady={() => setReady(true)} onLost={() => setFailed(true)} />
          </BallErrorBoundary>
        </div>
      )}
    </div>
  );
}