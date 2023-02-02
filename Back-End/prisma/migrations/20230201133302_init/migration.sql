-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ONLINE', 'OFFLINE', 'PLAYING');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ONLINE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
