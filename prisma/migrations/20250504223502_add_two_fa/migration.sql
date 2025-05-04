/*
  Warnings:

  - You are about to drop the column `twoFAToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "twoFAToken";

-- CreateTable
CREATE TABLE "TwoFAToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TwoFAToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TwoFAToken" ADD CONSTRAINT "TwoFAToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
