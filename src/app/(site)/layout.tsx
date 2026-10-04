import { ScrollProvider } from '@/context/ScrollContext';
import { Navbar } from '@/components/layout/Navbar';
import { SideNav } from '@/components/layout/SideNav';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { BackToTop } from '@/components/layout/BackToTop';

// Layout del sitio público. El admin tiene su propio layout y NO pasa por acá.
// (El Footer se suma en la fase 10, justo después de <main>.)
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-text-inverse"
      >
        Saltar al contenido
      </a>

      <ScrollProgress />
      <Navbar />
      <SideNav />
      <Breadcrumb />

      <main id="main-content">{children}</main>

      <BackToTop />
    </ScrollProvider>
  );
}