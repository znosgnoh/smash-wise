"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { formatCurrency, formatRelativeDate } from "@/lib/format";
import { DeleteExpenseButton } from "@/components/delete-expense-button";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import type { Expense, Member } from "@/lib/types";

interface ExpenseCardProps {
  expense: Expense;
  members: Member[];
  index?: number;
  showDelete?: boolean;
}

export function ExpenseCard({
  expense,
  members,
  index = 0,
  showDelete = false,
}: ExpenseCardProps): React.ReactElement {
  const payer = members.find((m) => m.id === expense.paidBy);
  const cat = EXPENSE_CATEGORIES.find((c) => c.value === expense.category);
  const icon = cat?.icon ?? "📦";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/2 p-3 sm:p-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-lg">
        {icon}
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
      {showDelete && (
        <div className="flex shrink-0 gap-1">
          <Link
            href={`/log/${expense.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-white/5 hover:text-zinc-300"
            aria-label="Edit expense"
          >
            ✏️
          </Link>
          <DeleteExpenseButton expenseId={expense.id} />
        </div>
      )}
    </motion.div>
  );
}
