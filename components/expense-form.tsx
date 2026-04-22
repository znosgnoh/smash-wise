"use client";

import { useState, useActionState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { addExpense } from "@/lib/actions/expenses";
import { settleUp } from "@/lib/actions/settlements";
import { MemberSelector } from "@/components/member-selector";
import { useToast } from "@/components/toast";
import { dollarsToCents, formatCurrency } from "@/lib/format";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import type { ExpenseCategory } from "@/lib/constants";
import type { Member, ActionResult } from "@/lib/types";

interface ExpenseFormProps {
  members: Member[];
}

const initialState: ActionResult = { success: true };

export function ExpenseForm({
  members,
}: ExpenseFormProps): React.ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const initialMode = searchParams.get("mode") === "settle" ? "settle" : "expense";
  const initialFrom = searchParams.get("from") ?? "";
  const initialTo = searchParams.get("to") ?? "";
  const initialAmount = searchParams.get("amount") ?? "";

  const [mode, setMode] = useState<"expense" | "settle">(initialMode);
  const [amount, setAmount] = useState(
    initialAmount ? (Number(initialAmount) / 100).toFixed(2) : "",
  );
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("court");
  const [paidBy, setPaidBy] = useState<string[]>(
    initialFrom ? [initialFrom] : [],
  );
  const [splitAmong, setSplitAmong] = useState<string[]>(
    initialTo ? [initialTo] : [],
  );

  const [state, formAction, pending] = useActionState(
    async (): Promise<ActionResult> => {
      const cents = dollarsToCents(amount);
      if (cents <= 0) {
        return { success: false, error: "Enter a valid amount" };
      }

      let result: ActionResult;

      if (mode === "settle") {
        if (paidBy.length === 0 || splitAmong.length === 0) {
          return { success: false, error: "Select both members" };
        }
        result = await settleUp({
          fromId: paidBy[0],
          toId: splitAmong[0],
          amount: cents,
        });
      } else {
        if (paidBy.length === 0) {
          return { success: false, error: "Select who paid" };
        }
        if (splitAmong.length === 0) {
          return { success: false, error: "Select at least one member to split" };
        }
        result = await addExpense({
          description: description.trim() || "Expense",
          amount: cents,
          category,
          paidBy: paidBy[0],
          splitAmong,
        });
      }

      if (result.success) {
        showToast(
          mode === "settle" ? "Settlement recorded!" : "Expense logged!",
        );
        router.push("/");
      }
      return result;
    },
    initialState,
  );

  const cents = dollarsToCents(amount);
  const perPerson =
    mode === "expense" && splitAmong.length > 0
      ? Math.floor(cents / splitAmong.length)
      : 0;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Mode toggle */}
      <div className="flex rounded-xl border border-white/10 bg-white/2 p-1">
        <button
          type="button"
          onClick={() => setMode("expense")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === "expense"
              ? "bg-cyan-500/10 text-cyan-400"
              : "text-zinc-500"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setMode("settle")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === "settle"
              ? "bg-emerald-500/10 text-emerald-400"
              : "text-zinc-500"
          }`}
        >
          Settle Up
        </button>
      </div>

      {/* Amount */}
      <div>
        <label
          htmlFor="amount"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Amount
        </label>
        <div className="flex items-center rounded-xl border border-white/10 bg-white/2 px-4 py-3 focus-within:border-cyan-500/50">
          <span className="text-xl text-zinc-500">$</span>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
            className="ml-2 w-full bg-transparent font-mono text-2xl font-bold text-zinc-100 outline-none placeholder:text-zinc-700 sm:text-3xl"
          />
        </div>
      </div>

      {/* Description (expense mode only) */}
      {mode === "expense" && (
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Description{" "}
            <span className="text-zinc-600">(optional)</span>
          </label>
          <input
            id="description"
            type="text"
            maxLength={200}
            placeholder="Court booking, shuttlecocks, drinks…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/2 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-cyan-500/50"
          />
        </div>
      )}

      {/* Category (expense mode only) */}
      {mode === "expense" && (
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex min-h-11 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                  category === cat.value
                    ? "border border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                    : "border border-white/10 bg-white/2 text-zinc-400 hover:border-white/20"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Paid by / From */}
      <MemberSelector
        members={members}
        selected={paidBy}
        onChange={setPaidBy}
        mode="single"
        label={mode === "expense" ? "Paid by" : "From"}
      />

      {/* Split among / To */}
      <MemberSelector
        members={members}
        selected={splitAmong}
        onChange={setSplitAmong}
        mode={mode === "expense" ? "multi" : "single"}
        label={mode === "expense" ? "Split among" : "To"}
      />

      {/* Live split calculation */}
      {mode === "expense" && splitAmong.length > 0 && cents > 0 && (
        <p className="text-center text-sm text-zinc-400">
          Split:{" "}
          <span className="font-mono font-semibold text-cyan-400">
            {formatCurrency(perPerson)}
          </span>{" "}
          each
        </p>
      )}

      {/* Error */}
      {!state.success && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-sm text-red-400">
          {state.error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className={`w-full rounded-xl py-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          mode === "settle"
            ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
            : "bg-cyan-500 text-zinc-950 hover:bg-cyan-400"
        }`}
      >
        {pending
          ? "Submitting…"
          : mode === "settle"
            ? "Record Settlement"
            : "Submit Expense"}
      </button>
    </form>
  );
}
