/** Fallback de <Suspense> mientras se carga el perfil. */
export function AboutSkeleton() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto mb-12 h-24 max-w-xl animate-pulse rounded-xl bg-bg-card" />
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="mx-auto h-72 w-72 animate-pulse rounded-xl border border-border bg-bg-card md:h-80 md:w-80" />
        <div className="h-96 animate-pulse rounded-xl border border-border bg-bg-card" />
      </div>
    </div>
  );
}
