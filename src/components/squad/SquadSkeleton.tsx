/** Fallback de <Suspense> mientras se cargan las skills. */
export function SquadSkeleton() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto mb-12 h-24 max-w-xl animate-pulse rounded-xl bg-bg-card" />
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-[28rem] animate-pulse rounded-xl border border-border bg-bg-card" />
        ))}
      </div>
    </div>
  );
}
