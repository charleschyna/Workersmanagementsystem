/*
  Warnings:

  - A unique constraint covering the columns `[taskExternalId]` on the table `TaskClaim` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TaskClaim_platform_taskExternalId_key";

-- CreateIndex
CREATE UNIQUE INDEX "TaskClaim_taskExternalId_key" ON "TaskClaim"("taskExternalId");
