export const dynamic = "force-dynamic";

import { getMembers, getExpenses, getSettlements } from "@/lib/queries";
import { EmptyState } from "@/components/empty-state";
import { HistoryFilter } from "@/components/history-filter";

export default async function HistoryPage(): Promise<React.ReactElement> {
  const [members, expenses, settlements] = await Promise.all([
    getMembers(),
    getExpenses(),
    getSettlements(),
  ]);

  const hasEntries = expenses.length > 0 || settlements.length > 0;

  if (!hasEntries) {
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-zinc-100">Expense History</h1>
      <HistoryFilter
        expenses={expenses}
        settlements={settlements}
        members={members}
      />
    </div>
  );
}
