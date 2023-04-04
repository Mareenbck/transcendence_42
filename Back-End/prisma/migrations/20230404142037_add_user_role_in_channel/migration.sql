-- CreateEnum
CREATE TYPE "UserRoleInChannel" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Chatroom" ADD COLUMN     "role" "UserRoleInChannel" NOT NULL DEFAULT 'USER';
