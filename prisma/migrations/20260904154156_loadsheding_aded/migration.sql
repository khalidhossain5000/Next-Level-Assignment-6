/*
  Warnings:

  - You are about to drop the `Outage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LoadSheddingStatus" AS ENUM ('PENDING', 'ONGOING', 'SCHEDULED', 'CANCELLED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Outage" DROP CONSTRAINT "Outage_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "Outage" DROP CONSTRAINT "Outage_userId_fkey";

-- DropTable
DROP TABLE "Outage";

-- CreateTable
CREATE TABLE "LoadSheddings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "LoadSheddingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "reason" TEXT DEFAULT 'N/A',
    "areaId" TEXT NOT NULL,

    CONSTRAINT "LoadSheddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outages" (
    "id" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "OutagePriority" NOT NULL DEFAULT 'NORMAL',
    "reported_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OutageStatus" NOT NULL DEFAULT 'REPORTED',
    "acknowledgedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "technicianId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_load_shedding_area_id" ON "LoadSheddings"("areaId");

-- CreateIndex
CREATE INDEX "idx_load_shedding_status_start_time" ON "LoadSheddings"("status", "startTime");

-- CreateIndex
CREATE INDEX "idx_outage_user_id" ON "Outages"("userId");

-- CreateIndex
CREATE INDEX "idx_outage_technician_id" ON "Outages"("technicianId");

-- CreateIndex
CREATE INDEX "idx_outage_status_created_at" ON "Outages"("status", "createdAt");

-- CreateIndex
CREATE INDEX "idx_outage_priority" ON "Outages"("priority");

-- AddForeignKey
ALTER TABLE "LoadSheddings" ADD CONSTRAINT "LoadSheddings_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outages" ADD CONSTRAINT "Outages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outages" ADD CONSTRAINT "Outages_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
