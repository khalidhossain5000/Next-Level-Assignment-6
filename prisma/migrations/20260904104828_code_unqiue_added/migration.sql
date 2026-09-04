/*
  Warnings:

  - You are about to alter the column `code` on the `Areas` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `code` on the `Feeders` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `code` on the `Substations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - A unique constraint covering the columns `[code]` on the table `Areas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Feeders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Substations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Zones` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Areas" DROP CONSTRAINT "Areas_feederId_fkey";

-- DropForeignKey
ALTER TABLE "Feeders" DROP CONSTRAINT "Feeders_substationId_fkey";

-- DropForeignKey
ALTER TABLE "Substations" DROP CONSTRAINT "Substations_zoneId_fkey";

-- AlterTable
ALTER TABLE "Areas" ALTER COLUMN "code" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "Feeders" ALTER COLUMN "code" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "Substations" ALTER COLUMN "code" SET DATA TYPE VARCHAR(10);

-- CreateIndex
CREATE UNIQUE INDEX "Areas_code_key" ON "Areas"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Feeders_code_key" ON "Feeders"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Substations_code_key" ON "Substations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Zones_code_key" ON "Zones"("code");

-- AddForeignKey
ALTER TABLE "Areas" ADD CONSTRAINT "Areas_feederId_fkey" FOREIGN KEY ("feederId") REFERENCES "Feeders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feeders" ADD CONSTRAINT "Feeders_substationId_fkey" FOREIGN KEY ("substationId") REFERENCES "Substations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Substations" ADD CONSTRAINT "Substations_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
