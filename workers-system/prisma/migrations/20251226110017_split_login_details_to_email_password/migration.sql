/*
  Warnings:

  - You are about to drop the column `loginDetails` on the `WorkAccount` table. All the data in the column will be lost.
  - Added the required column `email` to the `WorkAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `WorkAccount` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add new columns as optional (nullable)
ALTER TABLE "WorkAccount" ADD COLUMN "email" TEXT;
ALTER TABLE "WorkAccount" ADD COLUMN "password" TEXT;

-- Step 2: Copy existing loginDetails to both email and password columns
-- (Managers will need to update these with correct values)
UPDATE "WorkAccount" SET "email" = "loginDetails", "password" = "loginDetails";

-- Step 3: Make the columns required (NOT NULL)
ALTER TABLE "WorkAccount" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "WorkAccount" ALTER COLUMN "password" SET NOT NULL;

-- Step 4: Drop the old loginDetails column
ALTER TABLE "WorkAccount" DROP COLUMN "loginDetails";
