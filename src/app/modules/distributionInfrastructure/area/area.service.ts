import type { FeederWhereInput } from "../../../../generated/prisma/models"
import type { IQuery } from "../../../interfaces/interface"
import { prisma } from "../../../lib/prisma"
import { IFeederInterface } from "../feeder/feeder.interface"

const createAreaInDb = async (payload: IFeederInterface) => {
    const { name, code, voltageLevel,substationId} = payload


    const createdSubstationResult = await prisma.feeder.create({
        data: {
            name,
            voltageLevel,
            code,
            substationId
            

        },
        include: {
           substation:true,
           areas:true
        }
    })
    return createdSubstationResult

}

//get all substion ( not adding  filter)

const getAllFeederFromDb = async (query: IQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"



    const andConditions: FeederWhereInput[] = []


    //Searching
    if (query.searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: query.searchTerm, mode: "insensitive" } },
                { code: { contains: query.searchTerm, mode: "insensitive" } },
                {
                    voltageLevel: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },

            ],
        });
    }



    const allFeeders = await prisma.feeder.findMany({
        where: {
            AND: andConditions.length > 0 ? andConditions : undefined
        },
        take: limit,
        skip: skip,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
      areas:true,
            substation:true,
            zone:true
        }
    })

    const totalFeederCount = await prisma.feeder.count({
        where: {
            AND: andConditions
        }
    })


    return {
        data: allFeeders,
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

export const FeederService = {
    createFeederInDb,
    getAllFeederFromDb,
    getFeederDetails
}