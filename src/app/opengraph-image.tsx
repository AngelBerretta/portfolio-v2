import { ImageResponse } from 'next/og';
import { PLAYER } from '@/components/about/player-data';
import { SITE_URL } from '@/lib/site';

// Imagen que se ve al compartir el link en WhatsApp, LinkedIn, X, etc.
// Se genera una vez en el build (no usa APIs dinámicas) y se sirve en
// /opengraph-image. Replica la identidad del sitio: fondo oscuro, líneas de
// cancha, acento lima y la carta de jugador del hero.

export const alt = 'Angel Berretta — Full Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Satori (el motor de ImageResponse) no lee variables CSS: son los valores del
// kit "away" de globals.css escritos a mano.
const BG = '#080808';
const LINE = '#1a1a1a';
const BORDER = '#2e2e2e';
const ACCENT = '#ccff00';
const TEXT = '#f5f5f5';
const MUTED = '#999999';

const STACK = ['React', 'Next.js', 'Node.js', 'TypeScript'];

export default function OpengraphImage() {
  // Mismo cálculo que PlayerCard: promedio de los atributos.
  const rating = Math.round(
    PLAYER.attributes.reduce((sum, a) => sum + a.value, 0) / PLAYER.attributes.length
  );
  const host = new URL(SITE_URL).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: BG,
          color: TEXT,
        }}
      >
        {/* Línea media y círculo central */}
        <div style={{ position: 'absolute', left: 599, top: 0, width: 2, height: 630, background: LINE }} />
        <div
          style={{
            position: 'absolute',
            left: 340,
            top: 55,
            width: 520,
            height: 520,
            borderRadius: 9999,
            border: `2px solid ${LINE}`,
          }}
        />
        {/* Resplandor */}
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: -160,
            width: 620,
            height: 620,
            borderRadius: 9999,
            backgroundImage: 'radial-gradient(circle, rgba(204,255,0,0.16) 0%, rgba(204,255,0,0) 70%)',
          }}
        />

        {/* Texto */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            paddingLeft: 80,
          }}
        >
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, color: ACCENT }}>PORTFOLIO</div>
          <div style={{ display: 'flex', marginTop: 20, fontSize: 116, fontWeight: 700, lineHeight: 1 }}>
            Angel
          </div>
          <div style={{ display: 'flex', fontSize: 116, fontWeight: 700, lineHeight: 1, color: ACCENT }}>
            Berretta
          </div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 40, color: MUTED }}>
            Full Stack Developer
          </div>
          <div style={{ display: 'flex', marginTop: 36 }}>
            {STACK.map((tech) => (
              <div
                key={tech}
                style={{
                  display: 'flex',
                  marginRight: 12,
                  padding: '6px 14px',
                  border: `2px solid ${BORDER}`,
                  borderRadius: 10,
                  fontSize: 22,
                  color: MUTED,
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Carta de jugador */}
        <div style={{ display: 'flex', width: 460, alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 340,
              padding: 32,
              borderRadius: 24,
              border: '2px solid rgba(204,255,0,0.3)',
              backgroundImage: 'linear-gradient(180deg, #1f1f1f, #141414)',
            }}
          >
            <div style={{ display: 'flex', fontSize: 130, fontWeight: 700, lineHeight: 1, color: ACCENT }}>
              {rating}
            </div>
            <div style={{ display: 'flex', marginTop: 8, fontSize: 30, fontWeight: 700 }}>
              {PLAYER.position}
            </div>
            <div style={{ display: 'flex', height: 2, background: BORDER, margin: '24px 0' }} />
            <div style={{ display: 'flex', fontSize: 34, fontWeight: 700 }}>{PLAYER.name}</div>
            <div style={{ display: 'flex', marginTop: 6, fontSize: 22, color: MUTED }}>{PLAYER.title}</div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: 80, bottom: 44, display: 'flex', fontSize: 24, color: MUTED }}>
          {host}
        </div>
      </div>
    ),
    { ...size }
  );
}