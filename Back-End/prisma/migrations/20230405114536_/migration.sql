/*
  Warnings:

  - A unique constraint covering the columns `[channelId,userId]` on the table `UserOnChannel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `channelId` to the `UserOnChannel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserOnChannel" ADD COLUMN     "channelId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserOnChannel_channelId_userId_key" ON "UserOnChannel"("channelId", "userId");

-- AddForeignKey
ALTER TABLE "UserOnChannel" ADD CONSTRAINT "UserOnChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
