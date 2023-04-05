/*
  Warnings:

  - You are about to drop the column `role` on the `Chatroom` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatusOnChannel" AS ENUM ('CLEAN', 'MUTE', 'BAN');

-- AlterTable
ALTER TABLE "Chatroom" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "UserOnChannel" (
    "id" SERIAL NOT NULL,
    "role" "UserRoleInChannel" NOT NULL DEFAULT 'USER',
    "status" "UserStatusOnChannel" NOT NULL DEFAULT 'CLEAN',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserOnChannel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserOnChannel" ADD CONSTRAINT "UserOnChannel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
