-- AlterTable
ALTER TABLE "WorkAccount" ADD COLUMN     "finalEarnings" DECIMAL(65,30),
ADD COLUMN     "finalEarningsDate" TIMESTAMP(3),
ADD COLUMN     "finalEarningsProof" TEXT,
ADD COLUMN     "initialEarnings" DECIMAL(65,30),
ADD COLUMN     "initialEarningsDate" TIMESTAMP(3),
ADD COLUMN     "initialEarningsProof" TEXT,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidAt" TIMESTAMP(3);
