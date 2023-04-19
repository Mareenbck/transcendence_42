/*
  Warnings:

  - A unique constraint covering the columns `[userId,channelId]` on the table `ChannelRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChannelRequest_userId_channelId_key" ON "ChannelRequest"("userId", "channelId");
