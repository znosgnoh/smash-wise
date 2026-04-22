"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="text-4xl">⚠️</span>
      <h2 className="text-lg font-semibold text-zinc-100">
        Something went wrong
      </h2>
      <p className="max-w-xs text-sm text-zinc-500">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400"
      >
        Try again
      </button>
    </div>
  );
}
