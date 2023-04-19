/*
  Warnings:

  - You are about to drop the `ChannelRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatroomUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InvitationsStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "ChannelRequest" DROP CONSTRAINT "ChannelRequest_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelRequest" DROP CONSTRAINT "ChannelRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChatroomUsers" DROP CONSTRAINT "ChatroomUsers_chatroomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatroomUsers" DROP CONSTRAINT "ChatroomUsers_userId_fkey";

-- DropTable
DROP TABLE "ChannelRequest";

-- DropTable
DROP TABLE "ChatroomUsers";

-- DropEnum
DROP TYPE "ChannelRequestStatus";

-- CreateTable
CREATE TABLE "ChatroomInvitations" (
    "id" SERIAL NOT NULL,
    "status" "InvitationsStatus" NOT NULL DEFAULT 'PENDING',
    "chatroomId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatroomInvitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatroomInvitations_chatroomId_senderId_receiverId_key" ON "ChatroomInvitations"("chatroomId", "senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "ChatroomInvitations" ADD CONSTRAINT "ChatroomInvitations_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomInvitations" ADD CONSTRAINT "ChatroomInvitations_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomInvitations" ADD CONSTRAINT "ChatroomInvitations_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
