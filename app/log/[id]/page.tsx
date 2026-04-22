export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getActiveMembers, getExpense } from "@/lib/queries";
import { EditExpenseForm } from "@/components/edit-expense-form";
import { EmptyState } from "@/components/empty-state";

interface EditExpensePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExpensePage({
  params,
}: EditExpensePageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const [expense, activeMembers] = await Promise.all([
    getExpense(id),
    getActiveMembers(),
  ]);

  if (!expense) {
    notFound();
  }

  if (activeMembers.length < 2) {
    return (
      <div>
        <PageHeader />
        <EmptyState
          icon="👥"
          title="Need more members"
          description="Add at least 2 active members to edit expenses."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader />
      <Suspense>
        <EditExpenseForm expense={expense} members={activeMembers} />
      </Suspense>
    </div>
  );
}

function PageHeader(): React.ReactElement {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/history"
        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:text-zinc-100"
        aria-label="Back to history"
      >
        ←
      </Link>
      <h1 className="text-lg font-semibold text-zinc-100">Edit Expense</h1>
    </div>
  );
}
