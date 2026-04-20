"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { AddMemberInputSchema, RemoveMemberInputSchema } from "@/lib/schemas";
import type { ActionResult } from "@/lib/types";

export async function addMember(input: unknown): Promise<ActionResult> {
  const parsed = AddMemberInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const duplicate = await prisma.member.findFirst({
    where: {
      active: true,
      name: { equals: parsed.data.name, mode: "insensitive" },
    },
  });
  if (duplicate) {
    return { success: false, error: "A member with that name already exists" };
  }

  await prisma.member.create({
    data: { name: parsed.data.name },
  });

  revalidatePath("/");
  return { success: true };
}

export async function removeMember(input: unknown): Promise<ActionResult> {
  const parsed = RemoveMemberInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const member = await prisma.member.findFirst({
    where: { id: parsed.data.memberId, active: true },
  });
  if (!member) {
    return { success: false, error: "Member not found" };
  }

  await prisma.member.update({
    where: { id: parsed.data.memberId },
    data: { active: false },
  });

  revalidatePath("/");
  return { success: true };
}
