-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('PARTICIPATION_10', 'RECORD_100', 'LIKE_100');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('RUN', 'BIKE', 'SWIM');

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" INTEGER,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "goalRep" INTEGER NOT NULL,
    "discordWebhookUrl" TEXT,
    "discordInviteUrl" TEXT,
    "likeCount" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "recordCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "badges" "BadgeType"[],

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "exerciseType" "ExerciseType" NOT NULL,
    "description" TEXT,
    "time" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "photos" TEXT[],
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GroupToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_ownerId_key" ON "Group"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_GroupToTag_B_index" ON "_GroupToTag"("B");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToTag" ADD CONSTRAINT "_GroupToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToTag" ADD CONSTRAINT "_GroupToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
