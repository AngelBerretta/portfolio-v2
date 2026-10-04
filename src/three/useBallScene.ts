'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, type Group } from 'three';

// Ajustes de movimiento en un solo lugar.
const IDLE_SPIN = 0.35; // rad/s de giro propio
const SCROLL_SPIN = 0.004; // rad por px scrolleado (1000px ≈ 4 rad)
const SCROLL_TILT = 0.0012;
const BASE_TILT = 0.3;
const POINTER_TILT = 0.25; // rad máx. por mouse
const POINTER_SHIFT = 0.12; // desplazamiento máx. por mouse (unidades de escena)
const BOB_AMPLITUDE = 0.04;

// Guardia de rendimiento: si el promedio de FPS cae de este umbral durante
// la ventana de medición, bajamos la resolución de render una vez.
const PERF_WARMUP_FRAMES = 30;
const PERF_SAMPLE_FRAMES = 90;
const PERF_MIN_FPS = 38;

/**
 * Anima el balón: giro idle + giro/inclinación según scroll + parallax
 * suave con el mouse + flotación. Todo vive en refs y useFrame — nada de
 * setState por frame, así React no re-renderiza durante la animación.
 *
 * Devuelve el ref que hay que asignar al <group> del balón.
 *
 * Se lee window.scrollY directo (una lectura barata por frame) en vez de
 * suscribirse al ScrollContext, que re-renderizaría el árbol de R3F.
 */
export function useBallScene() {
  // El hook crea el ref y lo devuelve: Ball solo tiene que ponerlo en <group>.
  // (Recibirlo como argumento hace que el lint de React lo trate como una
  // prop mutada dentro de useFrame.)
  const group = useRef<Group>(null);
  const setDpr = useThree((s) => s.setDpr);
  const pointer = useRef({ x: 0, y: 0 });
  const spin = useRef(0);
  const perf = useRef({ frames: 0, elapsed: 0, done: false });

  useEffect(() => {
    // Solo dispositivos con mouse: en touch, pointermove casi no ocurre.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    const dt = Math.min(delta, 0.05); // evita saltos tras volver de otra pestaña
    const scrollY = window.scrollY;

    spin.current += dt * IDLE_SPIN;

    const targetY = spin.current + scrollY * SCROLL_SPIN;
    const targetX = BASE_TILT + scrollY * SCROLL_TILT + pointer.current.y * POINTER_TILT;

    g.rotation.y = MathUtils.damp(g.rotation.y, targetY, 6, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, targetX, 4, dt);
    g.position.x = MathUtils.damp(g.position.x, pointer.current.x * POINTER_SHIFT, 3, dt);
    g.position.y = Math.sin(state.clock.elapsedTime * 1.2) * BOB_AMPLITUDE;

    const p = perf.current;
    if (!p.done) {
      p.frames += 1;
      if (p.frames > PERF_WARMUP_FRAMES) {
        p.elapsed += delta;
        if (p.frames >= PERF_WARMUP_FRAMES + PERF_SAMPLE_FRAMES) {
          p.done = true;
          if (p.elapsed / PERF_SAMPLE_FRAMES > 1 / PERF_MIN_FPS) setDpr(1);
        }
      }
    }
  });

  return group;
}