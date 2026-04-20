export default function DashboardLoading(): React.ReactElement {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      {/* Header skeleton */}
      <div className="h-7 w-32 rounded-lg bg-white/5 lg:hidden" />

      {/* Summary skeleton */}
      <div className="rounded-2xl border border-white/5 bg-white/2 p-4 sm:p-6">
        <div className="h-4 w-28 rounded bg-white/5" />
        <div className="mt-2 h-8 w-36 rounded bg-white/5" />
        <div className="mt-2 h-3 w-24 rounded bg-white/5" />
      </div>

      {/* Balance rows skeleton */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl border border-white/5 bg-white/2"
          />
        ))}
      </div>
    </div>
  );
}
