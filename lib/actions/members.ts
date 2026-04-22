"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { AddMemberInputSchema, RemoveMemberInputSchema, SetupPinInputSchema } from "@/lib/schemas";
import { logActivity } from "@/lib/actions/activity";
import { isAdmin } from "@/lib/session";
import type { ActionResult } from "@/lib/types";

export async function addMember(input: unknown): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { success: false, error: "Only admins can add members" };
  }

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

  await logActivity("member.add", `Added member "${parsed.data.name}"`);

  revalidatePath("/");
  return { success: true };
}

export async function removeMember(input: unknown): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { success: false, error: "Only admins can remove members" };
  }

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

  await logActivity("member.remove", `Removed member "${member.name}"`);

  revalidatePath("/");
  return { success: true };
}

export async function setupPin(input: unknown): Promise<ActionResult> {
  const parsed = SetupPinInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const member = await prisma.member.findFirst({
    where: { id: parsed.data.memberId, active: true },
  });
  if (!member) {
    return { success: false, error: "Member not found" };
  }

  if (member.pin) {
    return { success: false, error: "PIN already set. Contact an admin to reset." };
  }

  await prisma.member.update({
    where: { id: parsed.data.memberId },
    data: { pin: parsed.data.pin },
  });

  await logActivity("member.setup_pin", `${member.name} set their PIN`);

  return { success: true };
}
