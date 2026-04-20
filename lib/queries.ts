import "server-only";
import { prisma } from "@/lib/prisma";
import type { Member, Expense, Settlement } from "@/lib/types";

/** Fetch all members (active + inactive) */
export async function getMembers(): Promise<Member[]> {
  const rows = await prisma.member.findMany({
    orderBy: { createdAt: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    active: r.active,
    createdAt: r.createdAt.toISOString(),
  }));
}

/** Fetch all active members */
export async function getActiveMembers(): Promise<Member[]> {
  const rows = await prisma.member.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    active: r.active,
    createdAt: r.createdAt.toISOString(),
  }));
}

/** Fetch all expenses with participants */
export async function getExpenses(): Promise<Expense[]> {
  const rows = await prisma.expense.findMany({
    include: { participants: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    description: r.description,
    amount: r.amount,
    paidBy: r.paidById,
    splitAmong: r.participants.map((p) => p.memberId),
    createdAt: r.createdAt.toISOString(),
  }));
}

/** Fetch all settlements */
export async function getSettlements(): Promise<Settlement[]> {
  const rows = await prisma.settlement.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    fromId: r.fromId,
    toId: r.toId,
    amount: r.amount,
    createdAt: r.createdAt.toISOString(),
  }));
}
