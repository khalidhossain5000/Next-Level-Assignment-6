/*
  Warnings:

  - You are about to drop the `TechnicianProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ZoneStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "TechnicianProfile" DROP CONSTRAINT "TechnicianProfile_userId_fkey";

-- DropTable
DROP TABLE "TechnicianProfile";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Areas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" "ZoneStatus" NOT NULL DEFAULT 'ACTIVE',
    "feederId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feeders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "voltageLevel" TEXT NOT NULL,
    "status" "ZoneStatus" NOT NULL DEFAULT 'ACTIVE',
    "substationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feeders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Substations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "ZoneStatus" NOT NULL DEFAULT 'ACTIVE',
    "zoneId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Substations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicianProfiles" (
    "id" TEXT NOT NULL,
    "expertise" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experience" INTEGER NOT NULL DEFAULT 0,
    "availability" "TechnicianStatus" NOT NULL DEFAULT 'AVAILABLE',
    "bio" TEXT,
    "resume" TEXT,
    "resumePublicId" TEXT,
    "technicianvProfileVerificationStatus" "TechnicianProfileStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TechnicianProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profileImage" TEXT DEFAULT 'https://i.ibb.co.com/mrH7HCPN/default-profile.png',
    "profileImagePublicId" TEXT NOT NULL DEFAULT '',
    "googleId" TEXT,
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'CREDENTIAL',
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ZoneStatus" NOT NULL DEFAULT 'ACTIVE',
    "zoneImageUrl" TEXT,
    "zoneImagePublicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_area_name" ON "Areas"("name");

-- CreateIndex
CREATE INDEX "idx_area_code" ON "Areas"("code");

-- CreateIndex
CREATE INDEX "idx_area_feeder_id" ON "Areas"("feederId");

-- CreateIndex
CREATE INDEX "idx_feeder_name" ON "Feeders"("name");

-- CreateIndex
CREATE INDEX "idx_feeder_code" ON "Feeders"("code");

-- CreateIndex
CREATE INDEX "idx_feeder_substation_id" ON "Feeders"("substationId");

-- CreateIndex
CREATE INDEX "idx_substation_name" ON "Substations"("name");

-- CreateIndex
CREATE INDEX "idx_substation_code" ON "Substations"("code");

-- CreateIndex
CREATE INDEX "idx_substation_zone_id" ON "Substations"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicianProfiles_userId_key" ON "TechnicianProfiles"("userId");

-- CreateIndex
CREATE INDEX "idx_technician_id" ON "TechnicianProfiles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_googleId_key" ON "Users"("googleId");

-- CreateIndex
CREATE INDEX "idx_user_email" ON "Users"("email");

-- CreateIndex
CREATE INDEX "idx_zone_name" ON "Zones"("name");

-- CreateIndex
CREATE INDEX "idx_zone_code" ON "Zones"("code");

-- AddForeignKey
ALTER TABLE "Areas" ADD CONSTRAINT "Areas_feederId_fkey" FOREIGN KEY ("feederId") REFERENCES "Feeders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feeders" ADD CONSTRAINT "Feeders_substationId_fkey" FOREIGN KEY ("substationId") REFERENCES "Substations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Substations" ADD CONSTRAINT "Substations_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicianProfiles" ADD CONSTRAINT "TechnicianProfiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
