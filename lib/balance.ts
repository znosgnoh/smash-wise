import type {
  Member,
  Expense,
  Settlement,
  MemberBalance,
  BalanceTransaction,
} from "@/lib/types";

/** Compute net balance for each active member */
export function computeNetBalances(
  members: readonly Member[],
  expenses: readonly Expense[],
  settlements: readonly Settlement[],
): Map<string, number> {
  const balances = new Map<string, number>();

  for (const member of members) {
    if (member.active) balances.set(member.id, 0);
  }

  for (const expense of expenses) {
    const splitCount = expense.splitAmong.length;
    const share = Math.floor(expense.amount / splitCount);
    const remainder = expense.amount - share * splitCount;

    // Payer gets credited the full amount
    balances.set(
      expense.paidBy,
      (balances.get(expense.paidBy) ?? 0) + expense.amount,
    );

    // Each participant gets debited their share
    for (let i = 0; i < expense.splitAmong.length; i++) {
      const id = expense.splitAmong[i];
      const memberShare = share + (i < remainder ? 1 : 0);
      balances.set(id, (balances.get(id) ?? 0) - memberShare);
    }
  }

  // Process settlements
  for (const settlement of settlements) {
    balances.set(
      settlement.fromId,
      (balances.get(settlement.fromId) ?? 0) + settlement.amount,
    );
    balances.set(
      settlement.toId,
      (balances.get(settlement.toId) ?? 0) - settlement.amount,
    );
  }

  return balances;
}

/** Convert net balances map to MemberBalance array */
export function toMemberBalances(
  netBalances: Map<string, number>,
): MemberBalance[] {
  return Array.from(netBalances.entries()).map(([memberId, amount]) => ({
    memberId,
    amount,
  }));
}

/** Minimize the number of transactions to settle all debts */
export function simplifyDebts(
  netBalances: Map<string, number>,
): BalanceTransaction[] {
  const creditors: Array<{ id: string; amount: number }> = [];
  const debtors: Array<{ id: string; amount: number }> = [];

  for (const [id, amount] of netBalances) {
    if (amount > 0) creditors.push({ id, amount });
    if (amount < 0) debtors.push({ id, amount: -amount });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions: BalanceTransaction[] = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const transfer = Math.min(creditors[ci].amount, debtors[di].amount);

    if (transfer > 0) {
      transactions.push({
        from: debtors[di].id,
        to: creditors[ci].id,
        amount: transfer,
      });
    }

    creditors[ci].amount -= transfer;
    debtors[di].amount -= transfer;

    if (creditors[ci].amount === 0) ci++;
    if (debtors[di].amount === 0) di++;
  }

  return transactions;
}

/** Get total outstanding amount across all simplified debts */
export function totalOutstanding(transactions: BalanceTransaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}
