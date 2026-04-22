export default function LogLoading(): React.ReactElement {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-lg bg-white/5" />
        <div className="h-6 w-32 rounded-lg bg-white/5" />
      </div>

      {/* Mode toggle */}
      <div className="h-10 rounded-xl border border-white/5 bg-white/2" />

      {/* Amount */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-16 rounded bg-white/5" />
        <div className="h-14 rounded-xl border border-white/5 bg-white/2" />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-24 rounded bg-white/5" />
        <div className="h-12 rounded-xl border border-white/5 bg-white/2" />
      </div>

      {/* Member selectors */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-16 rounded bg-white/5" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-11 w-20 rounded-full bg-white/5" />
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="h-12 rounded-xl bg-white/5" />
    </div>
  );
}
