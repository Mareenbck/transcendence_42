-- CreateTable
CREATE TABLE "jeux" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerOneId" INTEGER NOT NULL,
    "playerTwoId" INTEGER NOT NULL,
    "winnerId" INTEGER NOT NULL,

    CONSTRAINT "jeux_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jeux_playerOneId_key" ON "jeux"("playerOneId");

-- CreateIndex
CREATE UNIQUE INDEX "jeux_playerTwoId_key" ON "jeux"("playerTwoId");

-- AddForeignKey
ALTER TABLE "jeux" ADD CONSTRAINT "jeux_playerOneId_fkey" FOREIGN KEY ("playerOneId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jeux" ADD CONSTRAINT "jeux_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jeux" ADD CONSTRAINT "jeux_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
