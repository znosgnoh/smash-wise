export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  computeNetBalances,
  simplifyDebts,
  totalOutstanding,
} from "@/lib/balance";
import {
  getMembers,
  getExpenses,
  getSettlements,
} from "@/lib/queries";
import { BalanceSummaryCard } from "@/components/balance-summary-card";
import { BalanceCard } from "@/components/balance-card";
import { ExpenseCard } from "@/components/expense-card";
import { EmptyState } from "@/components/empty-state";
import { AnimatedFab } from "@/components/animated-fab";
import { PullToRefresh } from "@/components/pull-to-refresh";

export default async function DashboardPage(): Promise<React.ReactElement> {
  const [members, expenses, settlements] = await Promise.all([
    getMembers(),
    getExpenses(),
    getSettlements(),
  ]);
  const activeMembers = members.filter((m) => m.active);

  if (activeMembers.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="No members yet"
        description="Add your badminton group to get started."
      >
        <Link
          href="/members"
          className="mt-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400"
        >
          Add Members
        </Link>
      </EmptyState>
    );
  }

  const netBalances = computeNetBalances(
    members,
    expenses,
    settlements,
  );
  const transactions = simplifyDebts(netBalances);
  const outstanding = totalOutstanding(transactions);

  const recentExpenses = [...expenses]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <PullToRefresh>
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between lg:hidden">
        <h1 className="bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
          Smash Wise
        </h1>
      </div>

      {/* Balance Summary */}
      <BalanceSummaryCard
        totalOutstanding={outstanding}
        transactionCount={transactions.length}
      />

      {/* Simplified Balances */}
      {transactions.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-400">
            Simplified Balances
          </h2>
          <div className="flex flex-col gap-2">
            {transactions.map((t, i) => (
              <BalanceCard
                key={`${t.from}-${t.to}`}
                transaction={t}
                members={members}
                index={i}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Activity */}
      {recentExpenses.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-400">
              Recent Activity
            </h2>
            <Link
              href="/history"
              className="text-xs text-cyan-400 transition-colors hover:text-cyan-300"
            >
              View all →
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentExpenses.map((e, i) => (
              <ExpenseCard key={e.id} expense={e} members={members} index={i} />
            ))}
          </div>
        </section>
      )}

      {expenses.length === 0 && activeMembers.length > 0 && (
        <EmptyState
          icon="🏸"
          title="No expenses yet"
          description="Log your first expense after the next session!"
        >
          <Link
            href="/log"
            className="mt-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400"
          >
            Log Expense
          </Link>
        </EmptyState>
      )}

      {/* FAB */}
      <AnimatedFab />
    </div>
    </PullToRefresh>
  );
}
