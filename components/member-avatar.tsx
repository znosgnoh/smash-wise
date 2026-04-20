interface MemberAvatarProps {
  name: string;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
} as const;

export function MemberAvatar({
  name,
  size = "md",
}: MemberAvatarProps): React.ReactElement {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-zinc-100 ${sizeClasses[size]}`}
    >
      {initial}
    </div>
  );
}
