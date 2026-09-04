import { LoadSheddingStatus } from "../../../generated/prisma/enums";
import { LoadSheddingWhereInput } from "../../../generated/prisma/models";
import { IQuery } from "../../interfaces/interface";
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


//get all load shedding schedule

const getAllLoadSheddingSchdeule=async(query:IQuery)=>{
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
                    area:true,

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

export const LoadSheddingService = {
createLoadSheddingScheduleInDb,
getAllLoadSheddingSchdeule
}