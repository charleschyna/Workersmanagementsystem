-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MANAGER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Assigned', 'Accepted', 'Paused', 'Left');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskClaim" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "taskExternalId" TEXT NOT NULL,
    "screenshot" TEXT NOT NULL,
    "timeSpentHours" DECIMAL(65,30) NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'Pending',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "managerNotes" TEXT,

    CONSTRAINT "TaskClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkAccount" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT,
    "accountName" TEXT NOT NULL,
    "loginDetails" TEXT NOT NULL,
    "browserType" TEXT NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'Assigned',
    "recentlyUnpaused" BOOLEAN NOT NULL DEFAULT false,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "TaskClaim_platform_taskExternalId_key" ON "TaskClaim"("platform", "taskExternalId");

-- AddForeignKey
ALTER TABLE "TaskClaim" ADD CONSTRAINT "TaskClaim_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkAccount" ADD CONSTRAINT "WorkAccount_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
