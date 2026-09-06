import type { AreaWhereInput, FeederWhereInput } from "../../../../generated/prisma/models"
import type { IQuery } from "../../../interfaces/interface"
import { prisma } from "../../../lib/prisma"
import type { IAreaInterface, IUpdateAreaPayload } from "./area.interface"
import { AppError } from "../../../utils/AppError"
import httpStatus from "http-status"

const createAreaInDb = async (payload: IAreaInterface) => {
    const { name, code, address, feederId } = payload


    const createdAreaResult = await prisma.area.create({
        data: {
            name,
            address,
            code,
            feederId


        }

    })
    return createdAreaResult

}

//get all substion ( not adding  filter)

const getAllAreaFromDb = async (query: IQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"



    const andConditions: AreaWhereInput[] = []


    //Searching
    if (query.searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: query.searchTerm, mode: "insensitive" } },
                { code: { contains: query.searchTerm, mode: "insensitive" } },
                {
                    address: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },

            ],
        });
    }



    const allAreas = await prisma.area.findMany({
        where: {
            AND: andConditions.length > 0 ? andConditions : undefined
        },
        take: limit,
        skip: skip,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            feeder: true,
            substation: true,
            zone: true
        }
    })

    const totalAreaCount = await prisma.area.count({
        where: {
            AND: andConditions
        }
    })


    return {
        data: allAreas,
        meta: {
            page,
            limit,
            total: totalAreaCount,
            totalPages: Math.ceil(totalAreaCount / limit)
        }
    }




}


//substion details get protected
const getAreaDetails = async (areaId: string) => {
    const areaDetails = await prisma.area.findUnique({
        where: {
            id: areaId
        },
        include:
        {
            feeder: true,
            substation: true,
            zone: true
        }
    })
    return areaDetails
}

const updateArea = async (
    areaId: string,
    payload: IUpdateAreaPayload,
) => {
    const existingArea = await prisma.area.findUnique({
        where: { id: areaId },
    });

    if (!existingArea) {
        throw new AppError(httpStatus.NOT_FOUND, "Area not found");
    }

    if (payload.code && payload.code !== existingArea.code) {
        const areaWithSameCode = await prisma.area.findUnique({
            where: { code: payload.code },
        });

        if (areaWithSameCode) {
            throw new AppError(httpStatus.CONFLICT, "Area code already exists");
        }
    }

    if (payload.feederId && payload.feederId !== existingArea.feederId) {
        const feeder = await prisma.feeder.findUnique({
            where: { id: payload.feederId },
        });

        if (!feeder) {
            throw new AppError(httpStatus.NOT_FOUND, "Feeder not found");
        }
    }

    return prisma.area.update({
        where: { id: areaId },
        data: payload,
        include: {
            feeder: true,
        },
    });
};

export const AreaService = {
    createAreaInDb,
    getAllAreaFromDb,
    getAreaDetails,
    updateArea,
}