/*
  Warnings:

  - The `status` column on the `Areas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Feeders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Substations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Zones` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "InfrastructureStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Areas" DROP COLUMN "status",
ADD COLUMN     "status" "InfrastructureStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Feeders" DROP COLUMN "status",
ADD COLUMN     "status" "InfrastructureStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Substations" DROP COLUMN "status",
ADD COLUMN     "status" "InfrastructureStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Zones" DROP COLUMN "status",
ADD COLUMN     "status" "InfrastructureStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "ZoneStatus";
