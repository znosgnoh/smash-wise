interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  children,
}: EmptyStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="text-4xl">{icon}</span>
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
      <p className="max-w-xs text-sm text-zinc-500">{description}</p>
      {children}
    </div>
  );
}
