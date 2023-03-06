/*
  Warnings:

  - A unique constraint covering the columns `[userId,chatroomId]` on the table `ChatroomUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatroomUsers_userId_chatroomId_key" ON "ChatroomUsers"("userId", "chatroomId");
