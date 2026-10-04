// ballPattern.ts — genera el dibujo de un balón de fútbol (icosaedro
// truncado: 12 pentágonos + 20 hexágonos) de forma PROCEDURAL.
//
// Por qué procedural: así no hay que enviar un .glb ni una textura al
// navegador (cero bytes de assets, cero requests) y las costuras salen
// nítidas a cualquier resolución.
//
// Este archivo es matemática pura, sin dependencias de three ni del DOM:
// rellena un buffer RGBA equirectangular que después Ball.tsx convierte en
// textura. Cada píxel se mapea a una dirección en la esfera y se pregunta:
// ¿el centro de panel más cercano es de un pentágono o de un hexágono?

type Vec3 = readonly [number, number, number];
type RGB = readonly [number, number, number];

const PHI = (1 + Math.sqrt(5)) / 2;

function normalize([x, y, z]: Vec3): Vec3 {
  const len = Math.hypot(x, y, z);
  return [x / len, y / len, z / len];
}

/** Centros de los 12 pentágonos = vértices del icosaedro. */
const PENTAGON_CENTERS: Vec3[] = [];
for (const s1 of [-1, 1]) {
  for (const s2 of [-1, 1]) {
    PENTAGON_CENTERS.push(
      normalize([0, s1, s2 * PHI]),
      normalize([s1, s2 * PHI, 0]),
      normalize([s2 * PHI, 0, s1])
    );
  }
}

/** Centros de los 20 hexágonos = caras del icosaedro (vértices del dodecaedro).
 *  Ojo con la quiralidad: debe ser el dual DE ESTE icosaedro, por eso las
 *  permutaciones son (0,b,a), (b,a,0), (a,0,b) y no las otras. */
const HEX_CENTERS: Vec3[] = [];
for (const sx of [-1, 1]) {
  for (const sy of [-1, 1]) {
    for (const sz of [-1, 1]) HEX_CENTERS.push(normalize([sx, sy, sz]));
    const a = sx / PHI;
    const b = sy * PHI;
    HEX_CENTERS.push(normalize([0, b, a]), normalize([b, a, 0]), normalize([a, 0, b]));
  }
}

export interface BallPatternColors {
  hex: RGB;
  pent: RGB;
  seam: RGB;
}

export const DEFAULT_BALL_COLORS: BallPatternColors = {
  hex: [244, 244, 239],
  pent: [18, 18, 20],
  seam: [44, 44, 46],
};

// En un balón real el borde pentágono/hexágono queda ~1.8° más cerca del
// centro del pentágono que el punto medio exacto (los pentágonos son un poco
// más chicos); este sesgo (en radianes) lo corrige.
const PENT_BIAS = 0.032;
// Semiancho de las costuras, medido como diferencia de ángulos (radianes).
const SEAM_WIDTH = 0.034;

/**
 * Rellena `data` (RGBA, width × height, proyección equirectangular con el
 * mismo mapeo UV que SphereGeometry de three) con el dibujo del balón.
 */
export function fillBallPattern(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  colors: BallPatternColors = DEFAULT_BALL_COLORS
): void {
  const cosPhi = new Float64Array(width);
  const sinPhi = new Float64Array(width);
  for (let x = 0; x < width; x++) {
    const phi = ((x + 0.5) / width) * Math.PI * 2;
    cosPhi[x] = Math.cos(phi);
    sinPhi[x] = Math.sin(phi);
  }

  const nP = PENTAGON_CENTERS.length;
  const nH = HEX_CENTERS.length;

  for (let y = 0; y < height; y++) {
    const theta = ((y + 0.5) / height) * Math.PI;
    const sinT = Math.sin(theta);
    const dy = Math.cos(theta);

    for (let x = 0; x < width; x++) {
      // Misma parametrización que SphereGeometry de three.
      const dx = -cosPhi[x] * sinT;
      const dz = sinPhi[x] * sinT;

      let bestP = -2;
      for (let i = 0; i < nP; i++) {
        const c = PENTAGON_CENTERS[i];
        const d = dx * c[0] + dy * c[1] + dz * c[2];
        if (d > bestP) bestP = d;
      }

      let h1 = -2;
      let h2 = -2;
      for (let i = 0; i < nH; i++) {
        const c = HEX_CENTERS[i];
        const d = dx * c[0] + dy * c[1] + dz * c[2];
        if (d > h1) {
          h2 = h1;
          h1 = d;
        } else if (d > h2) {
          h2 = d;
        }
      }

      const angP = Math.acos(Math.min(1, bestP)) + PENT_BIAS;
      const angH1 = Math.acos(Math.min(1, h1));
      const angH2 = Math.acos(Math.min(1, h2));

      const isPentagon = angP < angH1;
      // Distancia (en ángulo) al borde más cercano de la celda actual.
      const edge = isPentagon ? angH1 - angP : Math.min(angP - angH1, angH2 - angH1);

      let t = 0;
      if (edge < SEAM_WIDTH) {
        const k = 1 - edge / SEAM_WIDTH;
        t = k * k;
      }

      const base = isPentagon ? colors.pent : colors.hex;
      const o = (y * width + x) * 4;
      data[o] = base[0] + (colors.seam[0] - base[0]) * t;
      data[o + 1] = base[1] + (colors.seam[1] - base[1]) * t;
      data[o + 2] = base[2] + (colors.seam[2] - base[2]) * t;
      data[o + 3] = 255;
    }
  }
}