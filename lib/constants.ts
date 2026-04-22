export const CURRENCY = "SGD";

export const EXPENSE_CATEGORIES = [
  { value: "court", label: "Court", icon: "🏸" },
  { value: "shuttle", label: "Shuttlecocks", icon: "🪶" },
  { value: "food", label: "Food & Drinks", icon: "🍜" },
  { value: "other", label: "Other", icon: "📦" },
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["value"];
