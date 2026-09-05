-- CreateEnum
CREATE TYPE "PlannedOutageStatus" AS ENUM ('SCHEDULED', 'ONGOING', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "customerId" TEXT NOT NULL,
    "outageReportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedOutages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "PlannedOutageStatus" NOT NULL DEFAULT 'SCHEDULED',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "areaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannedOutages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payments_transactionId_key" ON "Payments"("transactionId");

-- CreateIndex
CREATE INDEX "idx_payment_customer_id" ON "Payments"("customerId");

-- CreateIndex
CREATE INDEX "idx_payment_outage_report_id" ON "Payments"("outageReportId");

-- CreateIndex
CREATE INDEX "idx_payment_status" ON "Payments"("status");

-- CreateIndex
CREATE INDEX "idx_planned_outage_area_id" ON "PlannedOutages"("areaId");

-- CreateIndex
CREATE INDEX "idx_planned_outage_status_start_time" ON "PlannedOutages"("status", "startTime");

-- CreateIndex
CREATE INDEX "idx_planned_outage_start_end_time" ON "PlannedOutages"("startTime", "endTime");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_outageReportId_fkey" FOREIGN KEY ("outageReportId") REFERENCES "Outages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedOutages" ADD CONSTRAINT "PlannedOutages_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
