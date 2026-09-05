
import type { IQuery } from "../../interfaces/interface";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

import httpStatus from "http-status"
import type { IPlannedOutagePayload } from "./planned-outage.interface";
import type { PlannedOutageWhereInput } from "../../../generated/prisma/models";
import type { PlannedOutageStatus } from "../../../generated/prisma/enums";

//create planned outage

const createPlannedOutageInDb = async (
    payload: IPlannedOutagePayload
) => {
    const {title,areaId,description,endTime,reason,startTime} = payload;

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

    // 3. need to if Check area exists and is active
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

    // 4. Check plannedOutage  conflict in the same area
    const plannedOutageConflict =
        await prisma.plannedOutage.findFirst({
            where: {
                areaId,

                // Ignore all cancelled schedules
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

    if (plannedOutageConflict) {
        throw new AppError(
            httpStatus.CONFLICT,
            "A Planned Outage schedule already exists for this area during the selected time"
        );
    }

    // 5. Create schedule
    const createdSchedule =
        await prisma.plannedOutage.create({
            data: {
                title,
                startTime,
                endTime,
                description,
                reason,
                areaId,
            },
        });

    return createdSchedule;
};


//get all get All Planned Outage schedule

const getAllPlannedOutage = async (query: IQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"


    const andConditions: PlannedOutageWhereInput[] = []


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
                 {
                    description: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },

            ],
        });
    }



    if (query.status) {
        andConditions.push({
            status: query.status as PlannedOutageStatus,
        });
    }


    const allPlannedOutageSchedule = await prisma.plannedOutage.findMany({
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

    const totalPlannedOutageCount = await prisma.plannedOutage.count({
        where: {
            AND: andConditions
        }
    })


    return {
        data: allPlannedOutageSchedule,
        meta: {
            page,
            limit,
            total: totalPlannedOutageCount,
            totalPages: Math.ceil(totalPlannedOutageCount / limit)
        }
    }

}


//get planned outage details
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



export const PlannedOutageService = {
    createPlannedOutageInDb,
    getAllPlannedOutage,
    getLoadSheddingDetails,
    updateSchedule
}