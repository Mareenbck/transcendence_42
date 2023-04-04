-- CreateEnum
CREATE TYPE "UserChannelVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'PWD_PROTECTED');

-- AlterTable
ALTER TABLE "Chatroom" ADD COLUMN     "visibility" "UserChannelVisibility" NOT NULL DEFAULT 'PUBLIC';
