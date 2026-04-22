"use client";

import { useState, useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { deleteExpense } from "@/lib/actions/expenses";
import type { ActionResult } from "@/lib/types";

interface DeleteExpenseButtonProps {
  expenseId: string;
}

const initialState: ActionResult = { success: true };

export function DeleteExpenseButton({
  expenseId,
}: DeleteExpenseButtonProps): React.ReactElement {
  const [confirming, setConfirming] = useState(false);

  const [, formAction, pending] = useActionState(
    async (): Promise<ActionResult> => {
      const result = await deleteExpense({ expenseId });
      if (result.success) {
        setConfirming(false);
      }
      return result;
    },
    initialState,
  );

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {confirming ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="flex gap-1"
          >
            <form action={formAction}>
              <button
                type="submit"
                disabled={pending}
                className="min-h-8 rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
              >
                {pending ? "…" : "Delete"}
              </button>
            </form>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="min-h-8 rounded-md px-2 py-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Cancel
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => setConfirming(true)}
            className="min-h-8 min-w-8 rounded-md p-1 text-xs text-zinc-600 transition-colors hover:text-red-400"
            aria-label="Delete expense"
          >
            ✕
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
