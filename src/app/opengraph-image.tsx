import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { PLAYER, overallRating } from '@/components/about/player-data';
import { getPlayerAttributes } from '@/components/about/player-stats';
import { SITE_URL } from '@/lib/site';

// Imagen que se ve al compartir el link en WhatsApp, LinkedIn, X, etc.
// Se genera una vez en el build (no usa APIs dinámicas) y se sirve en
// /opengraph-image. Replica la identidad del sitio: fondo oscuro, líneas de
// cancha, acento lima y la carta de jugador del hero.
//
// IMPORTANTE: el dominio del pie sale de SITE_URL, que se resuelve en el
// build. Definí NEXT_PUBLIC_SITE_URL en Vercel ANTES de desplegar; si no, se
// "hornea" el dominio *.vercel.app en la imagen.

export const alt = 'Angel Berretta — Full Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Satori (el motor de ImageResponse) no lee variables CSS: son los valores del
// kit "away" de globals.css escritos a mano.
const BG = '#080808';
const LINE = '#1a1a1a';
const BORDER = '#2e2e2e';
const ACCENT = '#ccff00';
const WIN = '#22c55e';
const TEXT = '#f5f5f5';
const MUTED = '#999999';

const STACK = ['React', 'Next.js', 'Node.js', 'TypeScript'];

// Fuentes del sitio (Space Grotesk para títulos, Inter para el resto).
// Satori solo soporta ttf / otf / woff (no woff2, ni fuentes variables).
const FONTS_DIR = join(process.cwd(), 'assets', 'fonts');
const DISPLAY = 'Space Grotesk';
const BODY = 'Inter';

export default async function OpengraphImage() {
  const [attributes, displayFont, bodyFont] = await Promise.all([
    getPlayerAttributes(),
    readFile(join(FONTS_DIR, 'SpaceGrotesk-Bold.woff')),
    readFile(join(FONTS_DIR, 'Inter-Regular.woff')),
  ]);

  const rating = overallRating(attributes);
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
          fontFamily: BODY,
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
            paddingBottom: 50,
          }}
        >
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, color: ACCENT }}>PORTFOLIO</div>
          <div
            style={{
              display: 'flex',
              marginTop: 18,
              fontFamily: DISPLAY,
              fontSize: 108,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            Angel
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: DISPLAY,
              fontSize: 108,
              fontWeight: 700,
              lineHeight: 1,
              color: ACCENT,
            }}
          >
            Berretta
          </div>
          <div style={{ display: 'flex', marginTop: 24, fontSize: 38, color: MUTED }}>
            Full Stack Developer
          </div>

          <div style={{ display: 'flex', marginTop: 30 }}>
            {STACK.map((tech) => (
              <div
                key={tech}
                style={{
                  display: 'flex',
                  marginRight: 12,
                  padding: '6px 16px',
                  border: `2px solid ${BORDER}`,
                  borderRadius: 10,
                  fontSize: 26,
                  color: MUTED,
                }}
              >
                {tech}
              </div>
            ))}
          </div>

          {/* Disponibilidad: es lo primero que busca un reclutador. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              marginTop: 28,
              padding: '8px 18px',
              borderRadius: 9999,
              border: '2px solid rgba(34,197,94,0.35)',
              backgroundColor: 'rgba(34,197,94,0.1)',
              fontSize: 24,
              color: WIN,
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 12,
                height: 12,
                marginRight: 12,
                borderRadius: 9999,
                backgroundColor: WIN,
              }}
            />
            Disponible para trabajar
          </div>
        </div>

        {/* Carta de jugador */}
        <div style={{ display: 'flex', width: 460, alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 340,
              padding: 28,
              borderRadius: 24,
              border: '2px solid rgba(204,255,0,0.3)',
              backgroundImage: 'linear-gradient(180deg, #1f1f1f, #141414)',
            }}
          >
            {/* Puntuación general + posición */}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <div
                style={{
                  display: 'flex',
                  fontFamily: DISPLAY,
                  fontSize: 110,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: ACCENT,
                }}
              >
                {rating}
              </div>
              <div
                style={{
                  display: 'flex',
                  marginLeft: 16,
                  marginBottom: 10,
                  fontFamily: DISPLAY,
                  fontSize: 34,
                  fontWeight: 700,
                }}
              >
                {PLAYER.position}
              </div>
            </div>

            <div style={{ display: 'flex', height: 2, background: BORDER, margin: '20px 0 16px' }} />

            {/* Atributos (los mismos de la carta del sitio) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {attributes.map((attr) => (
                <div key={attr.label} style={{ display: 'flex', alignItems: 'baseline', marginTop: 6 }}>
                  <div
                    style={{
                      display: 'flex',
                      width: 52,
                      fontFamily: DISPLAY,
                      fontSize: 28,
                      fontWeight: 700,
                      color: ACCENT,
                    }}
                  >
                    {attr.value}
                  </div>
                  <div style={{ display: 'flex', fontSize: 24, color: MUTED }}>{attr.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 80,
            bottom: 44,
            display: 'flex',
            fontSize: 24,
            color: MUTED,
          }}
        >
          {host}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: DISPLAY, data: displayFont, weight: 700, style: 'normal' },
        { name: BODY, data: bodyFont, weight: 400, style: 'normal' },
      ],
    }
  );
}