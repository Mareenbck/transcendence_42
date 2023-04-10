/*
  Warnings:

  - You are about to drop the column `points` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "points",
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;
