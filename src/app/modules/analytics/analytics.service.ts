import { OutagePriority, OutageStatus, PaymentStatus, Role } from "../../../generated/prisma/enums";
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





const getTechnicianAnalyticsReport = async (userId:string) => {
  const totalAssignedOutages = await prisma.outage.count({
    where: {
      technicianId: userId,
      isDeleted: false,
    },
  });

  const activeOutages = await prisma.outage.count({
    where: {
      technicianId: userId,
      isDeleted: false,
      status: {
        in: [OutageStatus.ASSIGNED, OutageStatus.IN_PROGRESS],
      },
    },
  });

  const restoredOutages = await prisma.outage.count({
    where: {
      technicianId: userId,
      isDeleted: false,
      status: OutageStatus.RESTORED,
    },
  });

  const highPriorityOutages = await prisma.outage.count({
    where: {
      technicianId: userId,
      isDeleted: false,
      priority: OutagePriority.HIGH,
    },
  });

  const outageStatus = await prisma.outage.groupBy({
    by: ["status"],
    where: {
      technicianId: userId,
      isDeleted: false,
    },
    _count: {
      _all: true,
    },
  });

  return {
    totalAssignedOutages,
    activeOutages,
    restoredOutages,
    highPriorityOutages,
    outageStatus,
  };
};





const getAdminAnalyticsReport = async () => {
  const totalUsers = await prisma.user.count();

  const totalTechnicians = await prisma.user.count({
    where: {
      role: Role.TECHNICIAN,
    },
  });

  const totalReportedOutages = await prisma.outage.count({
    where: {
      isDeleted: false,
    },
  });

  const activeOutages = await prisma.outage.count({
    where: {
      isDeleted: false,
      status: {
        in: [
          OutageStatus.REPORTED,
          OutageStatus.ACKNOWLEDGED,
          OutageStatus.ASSIGNED,
          OutageStatus.IN_PROGRESS,
        ],
      },
    },
  });

  const restoredOutages = await prisma.outage.count({
    where: {
      isDeleted: false,
      status: OutageStatus.RESTORED,
    },
  });

  const totalRevenueResult = await prisma.payment.aggregate({
    where: {
      status: PaymentStatus.COMPLETED,
    },
    _sum: {
      amount: true,
    },
  });

  const totalRevenue =
    totalRevenueResult._sum.amount?.toNumber() || 0;

  const totalLoadSheddingSchedules = await prisma.loadShedding.count();

  const totalPlannedOutages = await prisma.plannedOutage.count();

  const outageStatus = await prisma.outage.groupBy({
    by: ["status"],
    where: {
      isDeleted: false,
    },
    _count: {
      _all: true,
    },
  });

  const userStatus = await prisma.user.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
  });

  return {
    totalUsers,
    totalTechnicians,
    totalReportedOutages,
    activeOutages,
    restoredOutages,
    totalRevenue,
    totalLoadSheddingSchedules,
    totalPlannedOutages,
    outageStatus,
    userStatus,
  };
};









export const AnalyticsServices={
    getCustomerAnalyticsReport,
    getTechnicianAnalyticsReport,
    getAdminAnalyticsReport
}