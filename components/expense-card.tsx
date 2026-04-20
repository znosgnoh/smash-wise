import { formatCurrency, formatRelativeDate } from "@/lib/format";
import type { Expense, Member } from "@/lib/types";

interface ExpenseCardProps {
  expense: Expense;
  members: Member[];
}

export function ExpenseCard({
  expense,
  members,
}: ExpenseCardProps): React.ReactElement {
  const payer = members.find((m) => m.id === expense.paidBy);

  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/2 p-3 sm:p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-lg">
        🏸
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium text-zinc-100">
          {expense.description}
        </span>
        <span className="text-xs text-zinc-500">
          Paid by {payer?.name ?? "Unknown"} · {expense.splitAmong.length}{" "}
          {expense.splitAmong.length === 1 ? "person" : "people"}
        </span>
        <span className="text-xs text-zinc-600">
          {formatRelativeDate(expense.createdAt)}
        </span>
      </div>
      <span className="shrink-0 font-mono text-sm font-semibold text-zinc-100">
        {formatCurrency(expense.amount)}
      </span>
    </div>
  );
}
