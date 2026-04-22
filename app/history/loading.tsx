export default function HistoryLoading(): React.ReactElement {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-7 w-40 rounded-lg bg-white/5" />

      {/* Month group skeleton */}
      <div className="flex flex-col gap-4">
        <div className="h-4 w-28 rounded bg-white/5" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[72px] rounded-xl border border-white/5 bg-white/2"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="h-4 w-32 rounded bg-white/5" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[72px] rounded-xl border border-white/5 bg-white/2"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
