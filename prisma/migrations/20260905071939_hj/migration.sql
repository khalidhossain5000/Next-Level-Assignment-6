/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `Payments` table. All the data in the column will be lost.
  - Added the required column `provider` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "paymentMethod",
ADD COLUMN     "provider" TEXT NOT NULL;
