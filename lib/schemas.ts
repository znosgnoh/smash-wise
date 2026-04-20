import { z } from "zod";

// --- Input schemas for Server Actions ---

export const AddMemberInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(50).trim(),
});

export const AddExpenseInputSchema = z.object({
  description: z.string().min(1, "Description is required").max(200).trim(),
  amount: z.number().int().positive("Amount must be greater than 0"),
  paidBy: z.string().min(1, "Payer is required"),
  splitAmong: z
    .array(z.string().min(1))
    .min(1, "Select at least one member"),
});

export const SettleUpInputSchema = z
  .object({
    fromId: z.string().min(1),
    toId: z.string().min(1),
    amount: z.number().int().positive("Amount must be greater than 0"),
  })
  .refine((data) => data.fromId !== data.toId, {
    message: "Cannot settle with yourself",
  });

export const RemoveMemberInputSchema = z.object({
  memberId: z.string().min(1),
});

export const DeleteExpenseInputSchema = z.object({
  expenseId: z.string().min(1),
});
