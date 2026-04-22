"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { AddExpenseInputSchema, DeleteExpenseInputSchema, EditExpenseInputSchema } from "@/lib/schemas";
import { logActivity } from "@/lib/actions/activity";
import { isAdmin } from "@/lib/session";
import type { ActionResult } from "@/lib/types";

export async function addExpense(input: unknown): Promise<ActionResult> {
  const parsed = AddExpenseInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const activeMembers = await prisma.member.findMany({
    where: { active: true },
    select: { id: true },
  });
  const activeIds = new Set(activeMembers.map((m) => m.id));

  if (!activeIds.has(parsed.data.paidBy)) {
    return { success: false, error: "Payer is not an active member" };
  }

  for (const id of parsed.data.splitAmong) {
    if (!activeIds.has(id)) {
      return { success: false, error: "Split includes inactive member" };
    }
  }

  // Compute per-participant amounts
  const splitAmounts = parsed.data.splitAmounts;
  const participants = parsed.data.splitAmong.map((memberId, i) => {
    if (splitAmounts && splitAmounts[memberId] !== undefined) {
      return { memberId, amount: splitAmounts[memberId] };
    }
    // Equal split with remainder distribution
    const share = Math.floor(parsed.data.amount / parsed.data.splitAmong.length);
    const remainder = parsed.data.amount - share * parsed.data.splitAmong.length;
    return { memberId, amount: share + (i < remainder ? 1 : 0) };
  });

  await prisma.expense.create({
    data: {
      description: parsed.data.description,
      amount: parsed.data.amount,
      category: parsed.data.category,
      paidById: parsed.data.paidBy,
      participants: {
        create: participants,
      },
    },
  });

  await logActivity(
    "expense.create",
    `Logged "${parsed.data.description}" for $${(parsed.data.amount / 100).toFixed(2)}`,
  );

  revalidatePath("/");
  return { success: true };
}

export async function deleteExpense(input: unknown): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { success: false, error: "Only admins can delete expenses" };
  }

  const parsed = DeleteExpenseInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const expense = await prisma.expense.findUnique({
    where: { id: parsed.data.expenseId },
  });
  if (!expense) {
    return { success: false, error: "Expense not found" };
  }

  await prisma.expense.delete({
    where: { id: parsed.data.expenseId },
  });

  await logActivity(
    "expense.delete",
    `Deleted expense "${expense.description}"`,
  );

  revalidatePath("/");
  return { success: true };
}

export async function editExpense(input: unknown): Promise<ActionResult> {
  const parsed = EditExpenseInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const existing = await prisma.expense.findUnique({
    where: { id: parsed.data.expenseId },
  });
  if (!existing) {
    return { success: false, error: "Expense not found" };
  }

  const activeMembers = await prisma.member.findMany({
    where: { active: true },
    select: { id: true },
  });
  const activeIds = new Set(activeMembers.map((m) => m.id));

  if (!activeIds.has(parsed.data.paidBy)) {
    return { success: false, error: "Payer is not an active member" };
  }

  for (const id of parsed.data.splitAmong) {
    if (!activeIds.has(id)) {
      return { success: false, error: "Split includes inactive member" };
    }
  }

  // Compute per-participant amounts
  const splitAmounts = parsed.data.splitAmounts;
  const participants = parsed.data.splitAmong.map((memberId, i) => {
    if (splitAmounts && splitAmounts[memberId] !== undefined) {
      return { memberId, amount: splitAmounts[memberId] };
    }
    const share = Math.floor(parsed.data.amount / parsed.data.splitAmong.length);
    const remainder = parsed.data.amount - share * parsed.data.splitAmong.length;
    return { memberId, amount: share + (i < remainder ? 1 : 0) };
  });

  await prisma.$transaction([
    prisma.expenseParticipant.deleteMany({
      where: { expenseId: parsed.data.expenseId },
    }),
    prisma.expense.update({
      where: { id: parsed.data.expenseId },
      data: {
        description: parsed.data.description,
        amount: parsed.data.amount,
        category: parsed.data.category,
        paidById: parsed.data.paidBy,
        participants: {
          create: participants,
        },
      },
    }),
  ]);

  await logActivity(
    "expense.edit",
    `Edited expense "${parsed.data.description}" ($${(parsed.data.amount / 100).toFixed(2)})`,
  );

  revalidatePath("/");
  return { success: true };
}
