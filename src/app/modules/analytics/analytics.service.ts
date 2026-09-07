import { OutagePriority, OutageStatus, PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"

const getCustomerAnalyticsReport = async (userId: string) => {
  const totalReportedOutages = await prisma.outage.count({
    where: {
      userId: userId,
      isDeleted: false,
    },
  });

  const highPriorityOutages = await prisma.outage.count({
    where: {
      userId: userId,
      isDeleted: false,
      priority: OutagePriority.HIGH,
    },
  });

  const restoredOutages = await prisma.outage.count({
    where: {
      userId: userId,
      isDeleted: false,
      status: OutageStatus.RESTORED,
    },
  });

  const totalSpentResult = await prisma.payment.aggregate({
    where: {
      customerId: userId,
      status: PaymentStatus.COMPLETED,
    },
    _sum: {
      amount: true,
    },
  });

  const totalSpent = totalSpentResult._sum.amount?.toNumber() || 0;

  const outageStatus = await prisma.outage.groupBy({
    by: ["status"],
    where: {
      userId: userId,
      isDeleted: false,
    },
    _count: {
      _all: true,
    },
  });

  return {
    totalReportedOutages,
    highPriorityOutages,
    restoredOutages,
    totalSpent,
    outageStatus,
  };
};

export const AnalyticsServices={
    getCustomerAnalyticsReport
}