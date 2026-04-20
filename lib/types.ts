/** A member of the badminton group */
export interface Member {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
}

/** An expense paid by one member, split among selected members */
export interface Expense {
  id: string;
  description: string;
  /** Amount in cents */
  amount: number;
  /** Member ID of the payer */
  paidBy: string;
  /** Member IDs of participants (includes payer if they participated) */
  splitAmong: string[];
  createdAt: string;
}

/** A settlement (payment) from one member to another */
export interface Settlement {
  id: string;
  /** Member ID of the debtor */
  fromId: string;
  /** Member ID of the creditor */
  toId: string;
  /** Amount in cents */
  amount: number;
  createdAt: string;
}

/** A simplified balance transaction for display */
export interface BalanceTransaction {
  from: string;
  to: string;
  amount: number;
}

/** Net balance for a single member */
export interface MemberBalance {
  memberId: string;
  /** Positive = others owe them, negative = they owe others */
  amount: number;
}

/** Shared return type for all server actions */
export type ActionResult =
  | { success: true }
  | { success: false; error: string };
