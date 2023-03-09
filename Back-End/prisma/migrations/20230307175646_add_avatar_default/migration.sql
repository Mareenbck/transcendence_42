-- AlterTable
ALTER TABLE "users" ADD COLUMN     "defaultAvatar" TEXT,
ALTER COLUMN "twoFA" SET DEFAULT true;
