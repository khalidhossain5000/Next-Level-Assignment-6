/*
  Warnings:

  - Made the column `zoneImageUrl` on table `Zones` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zoneImagePublicId` on table `Zones` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Zones" ALTER COLUMN "zoneImageUrl" SET NOT NULL,
ALTER COLUMN "zoneImagePublicId" SET NOT NULL;
