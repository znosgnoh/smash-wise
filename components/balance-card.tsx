import Link from "next/link";
import { MemberAvatar } from "@/components/member-avatar";
import { formatCurrency } from "@/lib/format";
import type { BalanceTransaction, Member } from "@/lib/types";

interface BalanceCardProps {
  transaction: BalanceTransaction;
  members: Member[];
}

export function BalanceCard({
  transaction,
  members,
}: BalanceCardProps): React.ReactElement {
  const fromMember = members.find((m) => m.id === transaction.from);
  const toMember = members.find((m) => m.id === transaction.to);

  if (!fromMember || !toMember) return <></>;

  const settleUrl = `/log?mode=settle&from=${transaction.from}&to=${transaction.to}&amount=${transaction.amount}`;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 p-3 sm:p-4">
      <MemberAvatar name={fromMember.name} size="sm" />
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1.5 text-sm text-zinc-100">
          <span className="font-medium">{fromMember.name}</span>
          <span className="text-zinc-600">→</span>
          <span className="font-medium">{toMember.name}</span>
        </div>
        <span className="font-mono text-lg font-semibold text-amber-400">
          {formatCurrency(transaction.amount)}
        </span>
      </div>
      <Link
        href={settleUrl}
        className="shrink-0 rounded-lg border border-cyan-500/30 px-3 py-1.5 text-xs font-medium text-cyan-400 transition-colors hover:bg-cyan-500/10"
      >
        Settle
      </Link>
    </div>
  );
}
