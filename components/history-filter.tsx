"use client";

import { useState } from "react";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { ExpenseCard } from "@/components/expense-card";
import { SettlementCard } from "@/components/settlement-card";
import { formatMonth } from "@/lib/format";
import type { Expense, Settlement, Member } from "@/lib/types";

type HistoryEntry =
  | { type: "expense"; data: Expense }
  | { type: "settlement"; data: Settlement };

interface HistoryFilterProps {
  expenses: Expense[];
  settlements: Settlement[];
  members: Member[];
  isAdmin?: boolean;
}

const ALL_FILTER = "all";
const SETTLEMENT_FILTER = "settlement";

export function HistoryFilter({
  expenses,
  settlements,
  members,
  isAdmin: admin = false,
}: HistoryFilterProps): React.ReactElement {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(ALL_FILTER);

  // Build entries
  const allEntries: HistoryEntry[] = [
    ...expenses.map((e) => ({ type: "expense" as const, data: e })),
    ...settlements.map((s) => ({ type: "settlement" as const, data: s })),
  ].sort(
    (a, b) =>
      new Date(b.data.createdAt).getTime() -
      new Date(a.data.createdAt).getTime(),
  );

  // Filter
  const filtered = allEntries.filter((entry) => {
    // Category filter
    if (categoryFilter === SETTLEMENT_FILTER) {
      if (entry.type !== "settlement") return false;
    } else if (categoryFilter !== ALL_FILTER) {
      if (entry.type !== "expense") return false;
      if ((entry.data as Expense).category !== categoryFilter) return false;
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      if (entry.type === "expense") {
        const e = entry.data as Expense;
        const payer = members.find((m) => m.id === e.paidBy);
        return (
          e.description.toLowerCase().includes(q) ||
          (payer?.name.toLowerCase().includes(q) ?? false)
        );
      } else {
        const s = entry.data as Settlement;
        const from = members.find((m) => m.id === s.fromId);
        const to = members.find((m) => m.id === s.toId);
        return (
          (from?.name.toLowerCase().includes(q) ?? false) ||
          (to?.name.toLowerCase().includes(q) ?? false) ||
          "settlement".includes(q)
        );
      }
    }

    return true;
  });

  // Group by month
  const grouped = new Map<string, HistoryEntry[]>();
  for (const entry of filtered) {
    const month = formatMonth(entry.data.createdAt);
    const existing = grouped.get(month);
    if (existing) {
      existing.push(entry);
    } else {
      grouped.set(month, [entry]);
    }
  }

  const filters = [
    { value: ALL_FILTER, label: "All", icon: "" },
    ...EXPENSE_CATEGORIES.map((c) => ({
      value: c.value,
      label: c.label,
      icon: c.icon,
    })),
    { value: SETTLEMENT_FILTER, label: "Settlements", icon: "💰" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search expenses…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/2 px-4 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-cyan-500/50"
      />

      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setCategoryFilter(f.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              categoryFilter === f.value
                ? "border border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                : "border border-white/10 bg-white/2 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {f.icon && <span className="mr-1">{f.icon}</span>}
            {f.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-600">
          No results found.
        </p>
      ) : (
        Array.from(grouped.entries()).map(([month, items]) => (
          <section key={month}>
            <h2 className="mb-3 text-sm font-semibold text-zinc-500">
              {month}
            </h2>
            <div className="flex flex-col gap-2">
              {items.map((entry, i) =>
                entry.type === "expense" ? (
                  <ExpenseCard
                    key={entry.data.id}
                    expense={entry.data}
                    members={members}
                    index={i}
                    showDelete={admin}
                  />
                ) : (
                  <SettlementCard
                    key={entry.data.id}
                    settlement={entry.data}
                    members={members}
                    index={i}
                  />
                ),
              )}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
