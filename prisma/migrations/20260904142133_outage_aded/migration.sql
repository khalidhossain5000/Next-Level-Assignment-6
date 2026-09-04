-- CreateEnum
CREATE TYPE "OutagePriority" AS ENUM ('HIGH', 'NORMAL');

-- CreateEnum
CREATE TYPE "OutageStatus" AS ENUM ('REPORTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'RESTORED', 'REJECTED');

-- CreateTable
CREATE TABLE "Outage" (
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

    CONSTRAINT "Outage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Outage" ADD CONSTRAINT "Outage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outage" ADD CONSTRAINT "Outage_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
