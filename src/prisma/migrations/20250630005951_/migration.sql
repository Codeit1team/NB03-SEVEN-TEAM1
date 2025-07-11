/*
  Warnings:

  - You are about to drop the column `tags` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "tags";

-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "groupId" DROP NOT NULL;

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
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_GroupToTag_B_index" ON "_GroupToTag"("B");

-- AddForeignKey
ALTER TABLE "_GroupToTag" ADD CONSTRAINT "_GroupToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToTag" ADD CONSTRAINT "_GroupToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
