"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { editExpense } from "@/lib/actions/expenses";
import { MemberSelector } from "@/components/member-selector";
import { useToast } from "@/components/toast";
import { dollarsToCents, formatCurrency } from "@/lib/format";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import type { ExpenseCategory } from "@/lib/constants";
import type { Expense, Member, ActionResult } from "@/lib/types";

interface EditExpenseFormProps {
  expense: Expense;
  members: Member[];
}

const initialState: ActionResult = { success: true };

export function EditExpenseForm({
  expense,
  members,
}: EditExpenseFormProps): React.ReactElement {
  const router = useRouter();
  const { showToast } = useToast();

  const [amount, setAmount] = useState((expense.amount / 100).toFixed(2));
  const [description, setDescription] = useState(expense.description);
  const [category, setCategory] = useState<ExpenseCategory>(
    (expense.category as ExpenseCategory) ?? "other",
  );
  const isCustomSplit = (() => {
    const equalShare = Math.floor(expense.amount / expense.splitAmong.length);
    return expense.splitAmong.some(
      (id) => Math.abs((expense.splitAmounts[id] ?? 0) - equalShare) > 1,
    );
  })();
  const [splitMode, setSplitMode] = useState<"equal" | "custom">(
    isCustomSplit ? "custom" : "equal",
  );
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>(
    Object.fromEntries(
      expense.splitAmong.map((id) => [
        id,
        ((expense.splitAmounts[id] ?? 0) / 100).toFixed(2),
      ]),
    ),
  );
  const [paidBy, setPaidBy] = useState<string[]>([expense.paidBy]);
  const [splitAmong, setSplitAmong] = useState<string[]>(expense.splitAmong);

  const [state, formAction, pending] = useActionState(
    async (): Promise<ActionResult> => {
      const cents = dollarsToCents(amount);
      if (cents <= 0) {
        return { success: false, error: "Enter a valid amount" };
      }
      if (paidBy.length === 0) {
        return { success: false, error: "Select who paid" };
      }
      if (splitAmong.length === 0) {
        return { success: false, error: "Select at least one member to split" };
      }

      const result = await editExpense({
        expenseId: expense.id,
        description: description.trim() || "Expense",
        amount: cents,
        category,
        paidBy: paidBy[0],
        splitAmong,
        ...(splitMode === "custom" && {
          splitAmounts: Object.fromEntries(
            splitAmong.map((id) => [id, dollarsToCents(customAmounts[id] ?? "0")]),
          ),
        }),
      });

      if (result.success) {
        showToast("Expense updated!");
        router.push("/history");
      }
      return result;
    },
    initialState,
  );

  const cents = dollarsToCents(amount);
  const perPerson =
    splitAmong.length > 0 ? Math.floor(cents / splitAmong.length) : 0;

  return (
    <form action={formAction} className="flex flex-col gap-6">
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

      {/* Description */}
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

      {/* Category */}
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

      {/* Paid by */}
      <MemberSelector
        members={members}
        selected={paidBy}
        onChange={setPaidBy}
        mode="single"
        label="Paid by"
      />

      {/* Split among */}
      <MemberSelector
        members={members}
        selected={splitAmong}
        onChange={(ids) => {
          setSplitAmong(ids);
          if (splitMode === "custom") {
            setCustomAmounts((prev) => {
              const next = { ...prev };
              for (const id of ids) {
                if (!(id in next)) next[id] = "";
              }
              return next;
            });
          }
        }}
        mode="multi"
        label="Split among"
      />

      {/* Split mode toggle */}
      {splitAmong.length > 0 && (
        <div>
          <div className="mb-2 flex rounded-lg border border-white/10 bg-white/2 p-0.5">
            <button
              type="button"
              onClick={() => setSplitMode("equal")}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                splitMode === "equal"
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-zinc-500"
              }`}
            >
              Equal Split
            </button>
            <button
              type="button"
              onClick={() => {
                setSplitMode("custom");
                const share = cents > 0
                  ? (cents / splitAmong.length / 100).toFixed(2)
                  : "";
                setCustomAmounts((prev) => {
                  const next = { ...prev };
                  for (const id of splitAmong) {
                    if (!next[id]) next[id] = share;
                  }
                  return next;
                });
              }}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                splitMode === "custom"
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-zinc-500"
              }`}
            >
              Custom Split
            </button>
          </div>

          {splitMode === "custom" && (
            <div className="flex flex-col gap-2">
              {splitAmong.map((id) => {
                const member = members.find((m) => m.id === id);
                return (
                  <div key={id} className="flex items-center gap-3">
                    <span className="min-w-20 truncate text-sm text-zinc-300">
                      {member?.name ?? "Unknown"}
                    </span>
                    <div className="flex flex-1 items-center rounded-lg border border-white/10 bg-white/2 px-3 py-2 focus-within:border-amber-500/50">
                      <span className="text-sm text-zinc-500">$</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={customAmounts[id] ?? ""}
                        onChange={(e) =>
                          setCustomAmounts((prev) => ({
                            ...prev,
                            [id]: e.target.value,
                          }))
                        }
                        className="ml-1 w-full bg-transparent font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-700"
                      />
                    </div>
                  </div>
                );
              })}
              {(() => {
                const customTotal = splitAmong.reduce(
                  (sum, id) => sum + dollarsToCents(customAmounts[id] ?? "0"),
                  0,
                );
                const diff = cents - customTotal;
                return (
                  <p
                    className={`text-center text-xs ${
                      diff === 0 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    Total: {formatCurrency(customTotal)} / {formatCurrency(cents)}
                    {diff !== 0 && (
                      <span>
                        {" "}
                        ({diff > 0 ? `${formatCurrency(diff)} remaining` : `${formatCurrency(-diff)} over`})
                      </span>
                    )}
                  </p>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Live split calculation (equal mode) */}
      {splitMode === "equal" && splitAmong.length > 0 && cents > 0 && (
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
        className="w-full rounded-xl bg-cyan-500 py-3.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
