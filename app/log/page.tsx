export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { getActiveMembers } from "@/lib/queries";
import { ExpenseForm } from "@/components/expense-form";
import { EmptyState } from "@/components/empty-state";

export default async function LogPage(): Promise<React.ReactElement> {
  const activeMembers = await getActiveMembers();

  if (activeMembers.length < 2) {
    return (
      <div>
        <PageHeader />
        <EmptyState
          icon="👥"
          title="Need more members"
          description="Add at least 2 members before logging expenses."
        >
          <Link
            href="/members"
            className="mt-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400"
          >
            Add Members
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader />
      <Suspense>
        <ExpenseForm members={activeMembers} />
      </Suspense>
    </div>
  );
}

function PageHeader(): React.ReactElement {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/"
        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:text-zinc-100"
        aria-label="Back to dashboard"
      >
        ←
      </Link>
      <h1 className="text-lg font-semibold text-zinc-100">Log Expense</h1>
    </div>
  );
}
