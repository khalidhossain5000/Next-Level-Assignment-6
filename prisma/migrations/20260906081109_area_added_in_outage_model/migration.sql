/*
  Warnings:

  - Added the required column `areaId` to the `Outages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Outages" ADD COLUMN     "areaId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Outages" ADD CONSTRAINT "Outages_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
