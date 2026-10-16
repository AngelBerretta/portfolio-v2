/** Fallback de <Suspense> mientras se cargan las skills. */
export function SquadSkeleton() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto mb-12 h-24 max-w-xl animate-pulse rounded-xl bg-bg-card" />
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[28rem_minmax(0,1fr)] lg:gap-x-10">
        <div className="mx-auto aspect-[68/105] w-full max-w-md animate-pulse rounded-xl border border-border bg-bg-card" />
        <div className="space-y-6">
          <div className="h-28 animate-pulse rounded-xl border border-border bg-bg-card" />
          <div className="h-72 animate-pulse rounded-xl border border-border bg-bg-card" />
        </div>
      </div>
    </div>
  );
}