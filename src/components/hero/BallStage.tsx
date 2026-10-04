'use client';

import { Component, useEffect, useState, type ReactNode } from 'react';
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
 * layout shift ni espera). Si el dispositivo lo permite, carga el 3D cuando
 * la página ya terminó de cargar y el navegador está ocioso, y lo funde
 * encima. Se queda en 2D si: reduced-motion, sin WebGL, ahorro de datos,
 * equipo de pocos recursos, o cualquier error.
 */
export function BallStage({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [idle, setIdle] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reducedMotion || failed || !canRender3D()) return;
    return whenIdleAfterLoad(() => setIdle(true));
  }, [reducedMotion, failed]);

  const show3D = idle && !reducedMotion && !failed;
  const threeVisible = show3D && ready;

  return (
    <div className={cn('relative', className)} aria-hidden="true">
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