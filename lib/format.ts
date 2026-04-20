import { CURRENCY } from "@/lib/constants";

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: CURRENCY,
  }).format(cents / 100);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatRelativeDate(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const days = Math.floor(diffMs / 86_400_000);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}

export function formatMonth(iso: string): string {
  return new Intl.DateTimeFormat("en-SG", {
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Convert a dollar amount string to cents */
export function dollarsToCents(dollars: string): number {
  const num = parseFloat(dollars);
  if (Number.isNaN(num)) return 0;
  return Math.round(num * 100);
}

/** Convert cents to a dollar display string (no currency symbol) */
export function centsToDisplay(cents: number): string {
  return (cents / 100).toFixed(2);
}
