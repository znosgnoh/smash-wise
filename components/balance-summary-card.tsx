"use client";

import { motion } from "motion/react";
import { formatCurrency } from "@/lib/format";
import { ConfettiOverlay } from "@/components/confetti-overlay";

interface BalanceSummaryCardProps {
  totalOutstanding: number;
  transactionCount: number;
}

export function BalanceSummaryCard({
  totalOutstanding,
  transactionCount,
}: BalanceSummaryCardProps): React.ReactElement {
  if (totalOutstanding === 0) {
    return (
      <>
        <ConfettiOverlay show />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center sm:p-6"
        >
        <span className="text-3xl">🎉</span>
        <h2 className="mt-2 text-lg font-semibold text-emerald-400">
          All squared up!
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          No outstanding balances. Time to play!
        </p>
      </motion.div>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-white/5 bg-white/2 p-4 sm:p-6"
    >
      <p className="text-sm text-zinc-500">Total outstanding</p>
      <p className="mt-1 font-mono text-2xl font-bold text-amber-400 sm:text-3xl">
        {formatCurrency(totalOutstanding)}
      </p>
      <p className="mt-1 text-xs text-zinc-600">
        across {transactionCount} settlement{transactionCount !== 1 ? "s" : ""}
      </p>
    </motion.div>
  );
}
