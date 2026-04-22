-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'other';

-- CreateIndex
CREATE INDEX "Expense_category_idx" ON "Expense"("category");
