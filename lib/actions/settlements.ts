"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { SettleUpInputSchema } from "@/lib/schemas";
import { logActivity } from "@/lib/actions/activity";
import type { ActionResult } from "@/lib/types";

export async function settleUp(input: unknown): Promise<ActionResult> {
  const parsed = SettleUpInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const activeMembers = await prisma.member.findMany({
    where: { active: true },
    select: { id: true },
  });
  const activeIds = new Set(activeMembers.map((m) => m.id));

  if (!activeIds.has(parsed.data.fromId)) {
    return { success: false, error: "Payer is not an active member" };
  }
  if (!activeIds.has(parsed.data.toId)) {
    return { success: false, error: "Recipient is not an active member" };
  }

  await prisma.settlement.create({
    data: {
      fromId: parsed.data.fromId,
      toId: parsed.data.toId,
      amount: parsed.data.amount,
    },
  });

  await logActivity(
    "settlement.create",
    `Settlement of $${(parsed.data.amount / 100).toFixed(2)} recorded`,
  );

  revalidatePath("/");
  return { success: true };
}
