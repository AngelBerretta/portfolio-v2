/**
 * Líneas de la cancha en SVG (proporción reglamentaria 68 × 105). Los colores
 * salen de los tokens, así que cambian solos con el kit home / away.
 * Es solo ornamento (aria-hidden).
 */
export function PitchMarkings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 68 105" className={className} aria-hidden="true" focusable="false">
      {/* Franjas de césped */}
      {[0, 2, 4, 6].map((i) => (
        <rect key={i} x="0" y={i * 15} width="68" height="15" className="fill-accent/5" />
      ))}

      <g className="fill-none stroke-text-primary/25" strokeWidth="0.35">
        {/* Perímetro, línea media y círculo central */}
        <rect x="2" y="2" width="64" height="101" />
        <line x1="2" y1="52.5" x2="66" y2="52.5" />
        <circle cx="34" cy="52.5" r="9.15" />

        {/* Área grande y chica (arriba) + media luna */}
        <rect x="13.84" y="2" width="40.32" height="16.5" />
        <rect x="24.84" y="2" width="18.32" height="5.5" />
        <path d="M26.69 18.5A9.15 9.15 0 0 0 41.31 18.5" />

        {/* Área grande y chica (abajo) + media luna */}
        <rect x="13.84" y="86.5" width="40.32" height="16.5" />
        <rect x="24.84" y="97.5" width="18.32" height="5.5" />
        <path d="M26.69 86.5A9.15 9.15 0 0 1 41.31 86.5" />

        {/* Córners */}
        <path d="M3 2A1 1 0 0 1 2 3" />
        <path d="M65 2A1 1 0 0 0 66 3" />
        <path d="M3 103A1 1 0 0 0 2 102" />
        <path d="M65 103A1 1 0 0 1 66 102" />
      </g>

      {/* Punto de saque y penales */}
      <g className="fill-text-primary/25">
        <circle cx="34" cy="52.5" r="0.6" />
        <circle cx="34" cy="13" r="0.5" />
        <circle cx="34" cy="92" r="0.5" />
      </g>
    </svg>
  );
}