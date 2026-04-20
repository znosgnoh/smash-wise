import { formatCurrency, formatRelativeDate } from "@/lib/format";
import type { Settlement, Member } from "@/lib/types";

interface SettlementCardProps {
  settlement: Settlement;
  members: Member[];
}

export function SettlementCard({
  settlement,
  members,
}: SettlementCardProps): React.ReactElement {
  const from = members.find((m) => m.id === settlement.fromId);
  const to = members.find((m) => m.id === settlement.toId);

  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/2 p-3 sm:p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-lg">
        💰
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium text-emerald-400">
          Settlement
        </span>
        <span className="text-xs text-zinc-500">
          {from?.name ?? "Unknown"} → {to?.name ?? "Unknown"}
        </span>
        <span className="text-xs text-zinc-600">
          {formatRelativeDate(settlement.createdAt)}
        </span>
      </div>
      <span className="shrink-0 font-mono text-sm font-semibold text-emerald-400">
        {formatCurrency(settlement.amount)}
      </span>
    </div>
  );
}
