-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "pin" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'member';
