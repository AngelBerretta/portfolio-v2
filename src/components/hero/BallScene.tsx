'use client';

// Único archivo del hero que importa three / @react-three/fiber (a través de
// Ball). Se carga con next/dynamic desde BallStage, así que todo esto queda
// en un chunk aparte y NO entra al bundle inicial de la página.

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Ball } from '@/three/Ball';

// Intensidades de luz: si el balón se ve lavado o muy oscuro, se ajusta acá.
const LIGHTS = { ambient: 0.7, key: 2.2, rim: 3.2 };

function readCssColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** Lee un token de color y se actualiza cuando cambia el kit home / away. */
function useCssColor(name: string, fallback: string) {
  const [color, setColor] = useState(() => readCssColor(name, fallback));

  useEffect(() => {
    const observer = new MutationObserver(() => setColor(readCssColor(name, fallback)));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-kit'],
    });
    return () => observer.disconnect();
  }, [name, fallback]);

  return color;
}

/** Avisa una sola vez, después del primer frame dibujado. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(onReady);
  });
  return null;
}

export default function BallScene({
  onReady,
  onLost,
}: {
  onReady: () => void;
  onLost: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const accent = useCssColor('--color-accent', '#ccff00');

  // Pausa el render cuando el hero sale de pantalla: cero GPU/CPU gastados
  // en un balón que nadie está viendo.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 3.8], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            onLost();
          });
        }}
      >
        <ambientLight intensity={LIGHTS.ambient} />
        <directionalLight position={[3, 3, 4]} intensity={LIGHTS.key} />
        {/* Luz de contorno con el color de acento: cambia sola con el kit. */}
        <directionalLight position={[-4, 1, -3]} intensity={LIGHTS.rim} color={accent} />
        <Ball />
        <ReadySignal onReady={onReady} />
      </Canvas>
    </div>
  );
}