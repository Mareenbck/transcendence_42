-- CreateEnum
CREATE TYPE "ChannelRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "ChannelRequest" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ChannelRequestStatus" NOT NULL DEFAULT 'PENDING',
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "ChannelRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChannelRequest" ADD CONSTRAINT "ChannelRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelRequest" ADD CONSTRAINT "ChannelRequest_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
