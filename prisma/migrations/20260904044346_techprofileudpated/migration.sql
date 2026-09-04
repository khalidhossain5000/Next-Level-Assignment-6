-- CreateEnum
CREATE TYPE "TechnicianProfileStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "TechnicianProfile" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "resume" TEXT,
ADD COLUMN     "resumePublicId" TEXT,
ADD COLUMN     "technicianvProfileVerificationStatus" "TechnicianProfileStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "idx_technician_id" ON "TechnicianProfile"("id");
