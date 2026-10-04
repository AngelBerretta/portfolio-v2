import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { KitProvider } from "@/context/KitContext";

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
  title: "Angel Berretta — Full Stack Developer",
  description:
    "Portfolio de Angel Berretta, Desarrollador Full Stack Freelance. Especializado en React, Node.js, Firebase y más.",
  keywords: [
    "Angel Berretta",
    "desarrollador full stack",
    "portfolio",
    "React",
    "JavaScript",
    "Node.js",
    "Firebase",
    "freelance",
  ],
  authors: [{ name: "Angel Berretta" }],
  openGraph: {
    title: "Angel Berretta — Full Stack Developer",
    description:
      "Portfolio de Angel Berretta, Desarrollador Full Stack Freelance. React, Node.js, Firebase y más.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Angel Berretta — Full Stack Developer",
    description: "Portfolio de Angel Berretta, Desarrollador Full Stack Freelance.",
  },
  icons: {
    icon: "/favicon.svg",
  },
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