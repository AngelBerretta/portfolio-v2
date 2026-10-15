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

// Si el 3D no está listo pasado este tiempo, se muestra el 2D igual para que
// el espacio no quede vacío (red lenta, equipo muy cargado).
const FALLBACK_AFTER_MS = 3000;

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
 * El balón 2D es la red de seguridad, no el primer paso. Nace oculto y solo
 * se muestra cuando ya se sabe que el 3D no va a llegar (o tarda demasiado):
 *   - el dispositivo no lo aguanta (WebGL, memoria, "ahorro de datos");
 *   - prefers-reduced-motion;
 *   - el 3D falló;
 *   - pasaron FALLBACK_AFTER_MS sin que el 3D esté listo.
 * En los demás casos entra directamente el 3D, con un fade, y no hay un
 * cambio 2D → 3D que se note.
 *
 * El 3D se carga recién cuando se cumplen TODAS estas condiciones, en orden:
 *   1. el balón entró en pantalla (IntersectionObserver). Si está oculto con
 *      display:none (mobile) nunca "entra", así que three.js no se descarga;
 *   2. la página terminó de cargar y el navegador está ocioso;
 *   3. el dispositivo lo aguanta.
 */
export function BallStage({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);
  const [idle, setIdle] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  // true cuando ya se decidió mostrar el 2D (ver el comentario de arriba).
  const [show2D, setShow2D] = useState(false);

  // 1. Esperar a que el balón sea visible. Una sola vez: después, BallScene
  //    pausa su propio render cuando sale de pantalla. En ese mismo momento
  //    se decide si el 2D hace falta ya o si se espera al 3D.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setInView(true);

      if (reducedMotion || !canRender3D()) {
        setShow2D(true);
      } else {
        timer = setTimeout(() => setShow2D(true), FALLBACK_AFTER_MS);
      }
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [reducedMotion]);

  // 2 y 3. Ya visible: esperar a que el navegador esté libre.
  useEffect(() => {
    if (!inView || reducedMotion || failed || !canRender3D()) return;
    return whenIdleAfterLoad(() => setIdle(true));
  }, [inView, reducedMotion, failed]);

  const show3D = idle && !reducedMotion && !failed;
  const threeVisible = show3D && ready;
  const fallbackVisible = (show2D || failed) && !threeVisible;

  return (
    <div ref={rootRef} className={cn('relative', className)} aria-hidden="true">
      <BallFallback
        className={cn(
          'absolute inset-0 h-full w-full transition-opacity duration-500',
          !fallbackVisible && 'opacity-0'
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