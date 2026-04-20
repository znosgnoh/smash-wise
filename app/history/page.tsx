export const dynamic = "force-dynamic";

import { getMembers, getExpenses, getSettlements } from "@/lib/queries";
import { formatMonth } from "@/lib/format";
import { ExpenseCard } from "@/components/expense-card";
import { SettlementCard } from "@/components/settlement-card";
import { EmptyState } from "@/components/empty-state";
import type { Expense, Settlement } from "@/lib/types";

type HistoryEntry =
  | { type: "expense"; data: Expense }
  | { type: "settlement"; data: Settlement };

export default async function HistoryPage(): Promise<React.ReactElement> {
  const [members, expenses, settlements] = await Promise.all([
    getMembers(),
    getExpenses(),
    getSettlements(),
  ]);

  // Merge expenses and settlements into a single timeline
  const entries: HistoryEntry[] = [
    ...expenses.map(
      (e) => ({ type: "expense" as const, data: e }),
    ),
    ...settlements.map(
      (s) => ({ type: "settlement" as const, data: s }),
    ),
  ].sort(
    (a, b) =>
      new Date(b.data.createdAt).getTime() -
      new Date(a.data.createdAt).getTime(),
  );

  if (entries.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-lg font-semibold text-zinc-100">
          Expense History
        </h1>
        <EmptyState
          icon="📋"
          title="No expenses yet"
          description="Your expense history will appear here after you log your first expense."
        />
      </div>
    );
  }

  // Group by month
  const grouped = new Map<string, HistoryEntry[]>();
  for (const entry of entries) {
    const month = formatMonth(entry.data.createdAt);
    const existing = grouped.get(month);
    if (existing) {
      existing.push(entry);
    } else {
      grouped.set(month, [entry]);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-zinc-100">Expense History</h1>

      {Array.from(grouped.entries()).map(([month, items]) => (
        <section key={month}>
          <h2 className="mb-3 text-sm font-semibold text-zinc-500">{month}</h2>
          <div className="flex flex-col gap-2">
            {items.map((entry) =>
              entry.type === "expense" ? (
                <ExpenseCard
                  key={entry.data.id}
                  expense={entry.data}
                  members={members}
                />
              ) : (
                <SettlementCard
                  key={entry.data.id}
                  settlement={entry.data}
                  members={members}
                />
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
