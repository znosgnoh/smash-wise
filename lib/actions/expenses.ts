"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { AddExpenseInputSchema, DeleteExpenseInputSchema } from "@/lib/schemas";
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

  await prisma.expense.create({
    data: {
      description: parsed.data.description,
      amount: parsed.data.amount,
      paidById: parsed.data.paidBy,
      participants: {
        create: parsed.data.splitAmong.map((memberId) => ({ memberId })),
      },
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function deleteExpense(input: unknown): Promise<ActionResult> {
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

  revalidatePath("/");
  return { success: true };
}
