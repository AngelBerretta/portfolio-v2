import { useId } from 'react';

type Pt = [number, number];

function pentagonPoints(cx: number, cy: number, r: number, rotationDeg: number): Pt[] {
  return Array.from({ length: 5 }, (_, i): Pt => {
    const a = ((rotationDeg + i * 72) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
}

const toAttr = (pts: Pt[]) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

const CX = 50;
const CY = 50;
const R = 41.5; // mismo tamaño relativo que el balón 3D (cámara z=3.8, fov 35)

// Pentágono central (vértice hacia arriba).
const CENTER = pentagonPoints(CX, CY, 13, -90);

// 5 pentágonos en el borde, uno en la dirección de cada vértice del central,
// con un vértice apuntando hacia adentro. El círculo los recorta.
const RIM = Array.from({ length: 5 }, (_, i) => {
  const angle = -90 + i * 72;
  const rad = (angle * Math.PI) / 180;
  return pentagonPoints(CX + 41 * Math.cos(rad), CY + 41 * Math.sin(rad), 14, angle + 180);
});

// Costuras: (1) del vértice del central al vértice interior de cada pentágono
// del borde; (2) entre pentágonos del borde vecinos, cerrando los hexágonos.
const SEAMS: { x1: number; y1: number; x2: number; y2: number }[] = [];
for (let i = 0; i < 5; i++) {
  SEAMS.push({
    x1: CENTER[i][0],
    y1: CENTER[i][1],
    x2: RIM[i][0][0],
    y2: RIM[i][0][1],
  });

  const next = RIM[(i + 1) % 5];
  let best: { d: number; a: Pt; b: Pt } | null = null;
  for (const a of RIM[i]) {
    for (const b of next) {
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (!best || d < best.d) best = { d, a, b };
    }
  }
  if (best) {
    SEAMS.push({ x1: best.a[0], y1: best.a[1], x2: best.b[0], y2: best.b[1] });
  }
}

/** Balón 2D estático en SVG. Sin JS, sin WebGL: se ve en el HTML inicial. */
export function BallFallback({ className }: { className?: string }) {
  const uid = useId();
  const clipId = `${uid}-clip`;
  const gradId = `${uid}-grad`;

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={gradId} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c9c9c2" />
        </radialGradient>
        <clipPath id={clipId}>
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>

      <circle cx={CX} cy={CY} r={R} fill={`url(#${gradId})`} />
      <g clipPath={`url(#${clipId})`} fill="#121214" stroke="#2c2c2e" strokeWidth="0.6" strokeLinejoin="round">
        <polygon points={toAttr(CENTER)} />
        {RIM.map((pts, i) => (
          <polygon key={i} points={toAttr(pts)} />
        ))}
        {SEAMS.map((s, i) => (
          <line key={i} {...s} fill="none" strokeLinecap="round" />
        ))}
      </g>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#2c2c2e" strokeWidth="0.5" />
    </svg>
  );
}