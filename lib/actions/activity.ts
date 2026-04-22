"use server";

import { prisma } from "@/lib/prisma";

export async function logActivity(
  action: string,
  detail: string,
): Promise<void> {
  await prisma.activityLog.create({
    data: { action, detail },
  });
}
