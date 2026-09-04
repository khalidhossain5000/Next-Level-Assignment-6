import type { AreaWhereInput, FeederWhereInput } from "../../../../generated/prisma/models"
import type { IQuery } from "../../../interfaces/interface"
import { prisma } from "../../../lib/prisma"
import type { IAreaInterface } from "./area.interface"

const createAreaInDb = async (payload: IAreaInterface) => {
    const { name, code, address,feederId} = payload


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
           feeder:true,
            substation:true,
            zone:true
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
            total: totalFeederCount,
            totalPages: Math.ceil(totalFeederCount / limit)
        }
    }




}


//substion details get protected
const getFeederDetails = async (feederId: string) => {
    const substationDetails = await prisma.feeder.findUnique({
        where: {
            id: feederId
        },
        include:
        {
            areas:true,
            substation:true,
            zone:true
        }
    })
    return substationDetails
}

export const AreaService = {
    createAreaInDb,
    getAllFeederFromDb,
    getFeederDetails
}