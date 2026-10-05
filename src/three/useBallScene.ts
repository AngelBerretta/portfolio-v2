'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, type Group } from 'three';

// Ajustes de movimiento en un solo lugar.
const IDLE_SPIN = 0.25; // rad/s de giro propio (el balón nunca queda muerto)
const SCROLL_SPIN = 0.004; // rad por px scrolleado (1000px ≈ 4 rad)
const SCROLL_TILT = 0.0012;
const BASE_TILT = 0.3;
const POINTER_YAW = 0.7; // rad máx. de giro horizontal por mouse
const POINTER_TILT = 0.45; // rad máx. de inclinación vertical por mouse
const POINTER_SHIFT = 0.15; // desplazamiento máx. por mouse (unidades de escena)
const BOB_AMPLITUDE = 0.04;

// Qué tan rápido persigue el balón al objetivo (más bajo = más suave).
const DAMP_YAW = 5;
const DAMP_TILT = 4;
const DAMP_SHIFT = 3;

// Guardia de rendimiento: si el promedio de FPS cae de este umbral durante
// la ventana de medición, bajamos la resolución de render una vez.
const PERF_WARMUP_FRAMES = 30;
const PERF_SAMPLE_FRAMES = 90;
const PERF_MIN_FPS = 38;

/**
 * Anima el balón: giro idle + giro/inclinación según scroll + rotación
 * guiada por el mouse + flotación. Todo vive en refs y useFrame — nada de
 * setState por frame, así React no re-renderiza durante la animación.
 *
 * El mouse NO controla el balón de forma directa (como OrbitControls): fija un
 * objetivo y `MathUtils.damp` (un lerp exponencial, independiente de los FPS)
 * lo persigue con suavidad. El balón sigue al cursor sin poder voltearse del
 * todo ni agarrarse con el mouse, así que no distrae.
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
    // Si el cursor sale de la ventana, el balón vuelve suavemente al centro.
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    const dt = Math.min(delta, 0.05); // evita saltos tras volver de otra pestaña
    const scrollY = window.scrollY;

    spin.current += dt * IDLE_SPIN;

    const targetY = spin.current + scrollY * SCROLL_SPIN + pointer.current.x * POINTER_YAW;
    const targetX = BASE_TILT + scrollY * SCROLL_TILT + pointer.current.y * POINTER_TILT;

    g.rotation.y = MathUtils.damp(g.rotation.y, targetY, DAMP_YAW, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, targetX, DAMP_TILT, dt);
    g.position.x = MathUtils.damp(g.position.x, pointer.current.x * POINTER_SHIFT, DAMP_SHIFT, dt);
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