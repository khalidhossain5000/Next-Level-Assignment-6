/*
  Warnings:

  - The values [REJECTED] on the enum `OutageStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OutageStatus_new" AS ENUM ('REPORTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'RESTORED', 'CANCELLED');
ALTER TABLE "public"."Outages" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Outages" ALTER COLUMN "status" TYPE "OutageStatus_new" USING ("status"::text::"OutageStatus_new");
ALTER TYPE "OutageStatus" RENAME TO "OutageStatus_old";
ALTER TYPE "OutageStatus_new" RENAME TO "OutageStatus";
DROP TYPE "public"."OutageStatus_old";
ALTER TABLE "Outages" ALTER COLUMN "status" SET DEFAULT 'REPORTED';
COMMIT;
