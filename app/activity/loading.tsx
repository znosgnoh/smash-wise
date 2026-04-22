export default function ActivityLoading(): React.ReactElement {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-7 w-36 rounded-lg bg-white/5" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-14 rounded-xl border border-white/5 bg-white/2"
          />
        ))}
      </div>
    </div>
  );
}
