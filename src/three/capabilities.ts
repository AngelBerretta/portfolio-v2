// capabilities.ts — decide SI vale la pena cargar el balón 3D, y CUÁNDO.
// No importa three: este archivo vive en el bundle inicial y tiene que ser
// liviano.

type NavigatorExtras = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

/** false → nos quedamos con el balón 2D. Solo llamar en el cliente. */
export function canRender3D(): boolean {
  if (typeof window === 'undefined') return false;

  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return false; // "Ahorro de datos" activado
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) return false;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) return false;
    // Liberamos el contexto de prueba: los navegadores limitan cuántos hay vivos.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function whenIdle(cb: () => void, timeout = 1500): () => void {
  // Safari no implementa requestIdleCallback (de ahí el typeof, no `in`).
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 300);
  return () => window.clearTimeout(id);
}

/**
 * Ejecuta `cb` cuando la página terminó de cargar Y el navegador está ocioso.
 * Así los ~150 KB de three + fiber no compiten con el LCP ni inflan el TBT.
 * Devuelve la función de cancelación (usar en el cleanup del efecto).
 */
export function whenIdleAfterLoad(cb: () => void): () => void {
  let cancelled = false;
  let cancelIdle: (() => void) | undefined;

  const start = () => {
    if (!cancelled) cancelIdle = whenIdle(cb);
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener('load', start);
    cancelIdle?.();
  };
}