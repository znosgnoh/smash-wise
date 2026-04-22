export default function MembersLoading(): React.ReactElement {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-24 rounded-lg bg-white/5" />
        <div className="h-4 w-16 rounded bg-white/5" />
      </div>

      {/* Add form skeleton */}
      <div className="flex gap-2">
        <div className="h-12 flex-1 rounded-xl border border-white/5 bg-white/2" />
        <div className="h-12 w-16 rounded-xl bg-white/5" />
      </div>

      {/* Member rows skeleton */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[68px] rounded-xl border border-white/5 bg-white/2"
          />
        ))}
      </div>
    </div>
  );
}
