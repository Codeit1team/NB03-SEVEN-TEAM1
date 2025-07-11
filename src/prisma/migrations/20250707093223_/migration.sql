/*
  Warnings:

  - The values [RUN,BIKE,SWIM] on the enum `ExerciseType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[groupId,nickname]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExerciseType_new" AS ENUM ('run', 'bike', 'swim');
ALTER TABLE "Record" ALTER COLUMN "exerciseType" TYPE "ExerciseType_new" USING ("exerciseType"::text::"ExerciseType_new");
ALTER TYPE "ExerciseType" RENAME TO "ExerciseType_old";
ALTER TYPE "ExerciseType_new" RENAME TO "ExerciseType";
DROP TYPE "ExerciseType_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_groupId_nickname_key" ON "Participant"("groupId", "nickname");
