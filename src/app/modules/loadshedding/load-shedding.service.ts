import { Prisma } from "../../../generated/prisma/client";
import { LoadSheddingStatus } from "../../../generated/prisma/enums";
import { LoadSheddingWhereInput } from "../../../generated/prisma/models";
import { IQuery } from "../../interfaces/interface";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ILoadSheddingPayload, ILoadSheddingUpdatePayload } from "./load-shedding.interface"
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


//get all load shedding schedule

const getAllLoadSheddingSchdeule = async (query: IQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"


    const andConditions: LoadSheddingWhereInput[] = []


    //Searching
    if (query.searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: query.searchTerm, mode: "insensitive" } },
                {
                    reason: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },

            ],
        });
    }



    if (query.status) {
        andConditions.push({
            status: query.status as LoadSheddingStatus,
        });
    }


    const allLoadsheddingSchdeule = await prisma.loadShedding.findMany({
        where: {
            AND: andConditions.length > 0 ? andConditions : undefined
        },
        take: limit,
        skip: skip,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            area: true,

        }
    })

    const totalLoadSheddingCount = await prisma.loadShedding.count({
        where: {
            AND: andConditions
        }
    })


    return {
        data: allLoadsheddingSchdeule,
        meta: {
            page,
            limit,
            total: totalLoadSheddingCount,
            totalPages: Math.ceil(totalLoadSheddingCount / limit)
        }
    }

}



const getLoadSheddingDetails = async (loadsheddingId: string) => {
    const getDetails = await prisma.loadShedding.findUniqueOrThrow({
        where: {
            id: loadsheddingId
        }
    })
    return getDetails
}





//update load shedding scheudle

const updateSchedule = async (
  payload: ILoadSheddingUpdatePayload,
  loadSheddingId: string
) => {
  // 1. Find existing schedule
  const existingSchedule = await prisma.loadShedding.findUnique({
    where: {
      id: loadSheddingId,
    },
  });

  if (!existingSchedule) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Load shedding schedule not found"
    );
  }

  // 2. Get final values
 
  const finalStartTime = payload.startTime ?? existingSchedule.startTime;
  const finalEndTime = payload.endTime ?? existingSchedule.endTime;

  // 3. Validate time range
  if (finalStartTime >= finalEndTime) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start time must be before end time"
    );
  }

  // 4. Start time cannot be in the past checkh ere
 
  if (
    payload.startTime &&
    finalStartTime < new Date()
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Load shedding schedule cannot start in the past"
    );
  }

  // 5. Check area is still active
  const area = await prisma.area.findUnique({
    where: {
      id: existingSchedule.areaId,
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
      "Cannot update schedule for an inactive area"
    );
  }

  // 6. Check conflict with other schedules in same area or not
  const conflictingSchedule =
    await prisma.loadShedding.findFirst({
      where: {
        areaId: existingSchedule.areaId,


        id: {
          not: loadSheddingId,
        },

        status: {
          not: "CANCELLED",
        },

        startTime: {
          lt: finalEndTime,
        },
        endTime: {
          gt: finalStartTime,
        },
      },
    });

  if (conflictingSchedule) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Another load shedding schedule already exists during the selected time"
    );
  }

  // 7. Build update data
  const updateData: Prisma.LoadSheddingUpdateInput = {};

  if (payload.title !== undefined) {
    updateData.title = payload.title;
  }

  if (payload.startTime !== undefined) {
    updateData.startTime = payload.startTime;
  }

  if (payload.endTime !== undefined) {
    updateData.endTime = payload.endTime;
  }

  if (payload.reason !== undefined) {
    updateData.reason = payload.reason;
  }


  // 8. Update
  const updatedSchedule = await prisma.loadShedding.update({
    where: {
      id: loadSheddingId,
    },
    data: updateData,
  });

  return updatedSchedule;
};

export const LoadSheddingService = {
    createLoadSheddingScheduleInDb,
    getAllLoadSheddingSchdeule,
    getLoadSheddingDetails,
    updateSchedule
}