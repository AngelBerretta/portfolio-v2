import { SectionHeading } from '@/components/shared/SectionHeading';
import { TransferForm } from './TransferForm';
import { TransferInfo } from './TransferInfo';

/**
 * Sección de contacto ("Fichaje" en el menú). Es estática: no consulta la DB,
 * así que no necesita <Suspense>. Usa id="contact" porque es el que espera el
 * scroll spy y nav-items.ts.
 */
export function TransferSection() {
  return (
    <section
      id="contact"
      aria-labelledby="transfer-heading"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-64 w-[600px] max-w-full -translate-x-1/2 rounded-full bg-accent-ghost blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="transfer-heading"
          eyebrow="04 · Fichaje"
          title="Trabajemos juntos"
          description="¿Tenés un proyecto en mente? Estoy disponible para trabajar Full Time. Escribime y lo conversamos."
        />

        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <TransferInfo />
          <TransferForm />
        </div>
      </div>
    </section>
  );
}
