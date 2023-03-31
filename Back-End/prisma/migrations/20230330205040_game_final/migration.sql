/*
  Warnings:

  - You are about to drop the column `finishedAt` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `playerOneOnGameId` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `playerTwosOnGameId` on the `games` table. All the data in the column will be lost.
  - You are about to drop the `UserOnGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jeux` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `playerOneId` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerTwoId` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score1` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score2` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerId` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserOnGame" DROP CONSTRAINT "UserOnGame_userId_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_playerOneOnGameId_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_playerTwosOnGameId_fkey";

-- DropForeignKey
ALTER TABLE "jeux" DROP CONSTRAINT "jeux_playerOneId_fkey";

-- DropForeignKey
ALTER TABLE "jeux" DROP CONSTRAINT "jeux_playerTwoId_fkey";

-- DropForeignKey
ALTER TABLE "jeux" DROP CONSTRAINT "jeux_winnerId_fkey";

-- DropIndex
DROP INDEX "games_playerOneOnGameId_key";

-- DropIndex
DROP INDEX "games_playerTwosOnGameId_key";

-- AlterTable
ALTER TABLE "games" DROP COLUMN "finishedAt",
DROP COLUMN "playerOneOnGameId",
DROP COLUMN "playerTwosOnGameId",
ADD COLUMN     "playerOneId" INTEGER NOT NULL,
ADD COLUMN     "playerTwoId" INTEGER NOT NULL,
ADD COLUMN     "score1" INTEGER NOT NULL,
ADD COLUMN     "score2" INTEGER NOT NULL,
ADD COLUMN     "winnerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserOnGame";

-- DropTable
DROP TABLE "jeux";

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_playerOneId_fkey" FOREIGN KEY ("playerOneId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
