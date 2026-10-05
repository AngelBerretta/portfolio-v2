import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { KitProvider } from "@/context/KitContext";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  buildOpenGraph,
} from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  // Base para resolver URLs relativas (imágenes OG, canonical) a absolutas.
  metadataBase: new URL(SITE_URL),
  // Las páginas definen solo su parte: title: "Proyectos" → "Proyectos | Angel Berretta".
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Angel Berretta",
    "desarrollador full stack",
    "portfolio",
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Firebase",
    "freelance",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: buildOpenGraph({ title: SITE_TITLE, description: SITE_DESCRIPTION }),
  // La imagen sale de app/twitter-image.tsx.
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

// Los dos kits (home / away) son oscuros, así que el color de la barra del
// navegador móvil y de los controles nativos queda fijo en el del kit away.
export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

/**
 * Script anti-flash. Corre ANTES de que React hidrate para evitar
 * que la página se muestre con el kit default y después cambie.
 */
const kitScript = `
(function() {
  try {
    var stored = localStorage.getItem('portfolio-kit');
    var kit = (stored === 'home' || stored === 'away')
      ? stored
      : 'away';
    document.documentElement.setAttribute('data-kit', kit);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-kit="away" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: kitScript }} />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <KitProvider>{children}</KitProvider>
      </body>
    </html>
  );
}