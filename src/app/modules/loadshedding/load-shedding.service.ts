import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ILoadSheddingPayload } from "./load-shedding.interface"
import httpStatus from "http-status"
const createLoadSheddingScheduleInDb = async (
  payload: ILoadSheddingPayload
) => {
  const { title, startTime, endTime, status, reason, areaId } = payload;

  // 1. Validate time range
  if (startTime >= endTime) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start time must be before end time"
    );
  }

  // 2. Start time cannot be in the past
  if (startTime < new Date()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Load shedding schedule cannot start in the past"
    );
  }

  // 3. Check area exists and is active
  const area = await prisma.area.findUnique({
    where: {
      id: areaId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!area) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Area not found"
    );
  }

  if (area.status !== "ACTIVE") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot create load shedding schedule for an inactive area"
    );
  }

  // 4. Check schedule conflict in the same area
  const conflictingSchedule =
    await prisma.loadShedding.findFirst({
      where: {
        areaId,

        // Ignore cancelled schedules
        status: {
          not: "CANCELLED",
        },


        startTime: {
          lt: endTime,
        },

        endTime: {
          gt: startTime,
        },
      },
    });

  if (conflictingSchedule) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A load shedding schedule already exists for this area during the selected time"
    );
  }

  // 5. Create schedule
  const createdSchedule =
    await prisma.loadShedding.create({
      data: {
        title,
        startTime,
        endTime,
        status,
        reason,
        areaId,
      },
    });

  return createdSchedule;
};




export const LoadSheddingService = {
createLoadSheddingScheduleInDb
}