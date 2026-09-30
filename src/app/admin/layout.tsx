import type { Metadata } from 'next';

// Este layout envuelve TODO lo que está bajo /admin, incluyendo /admin/login
// (a diferencia del layout dentro de (protected), que solo envuelve las
// rutas autenticadas). Su único trabajo es evitar que Google indexe el panel.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
