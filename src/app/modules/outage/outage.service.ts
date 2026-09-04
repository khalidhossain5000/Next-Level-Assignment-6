import { OutageStatus } from "../../../generated/prisma/enums"
import { OutageWhereInput } from "../../../generated/prisma/models"
import { IQuery } from "../../interfaces/interface"
import { prisma } from "../../lib/prisma"
import { IOutagePayload } from "./outage.interface"

export const createOutageInDb = async (payload: IOutagePayload, userId: string) => {

    const { cause, description, priority } = payload

    const outageCreatedResult = await prisma.outage.create({
        data: {
            cause,
            description,
            priority,
            userId
        }
    })
    return outageCreatedResult
}


//get all outage fora dmin manage

const getAllOutageFromDb=async(query:IQuery)=>{
     const limit = query.limit ? Number(query.limit) : 10;
        const page = query.page ? Number(query.page) : 1;
        const skip = (page - 1) * limit;
        const sortBy = query.sortBy ? query.sortBy : "createdAt";
        const sortOrder = query.sortOrder ? query.sortOrder : "desc"
    
    
        const andConditions: OutageWhereInput[] = []
    
    
        //Searching
        if (query.searchTerm) {
            andConditions.push({
                OR: [
                    { cause: { contains: query.searchTerm, mode: "insensitive" } },
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
                status: query.status as OutageStatus,
            });
        }
    
    
        const allOutages = await prisma.outage.findMany({
            where: {
                AND: andConditions.length > 0 ? andConditions : undefined
            },
            take: limit,
            skip: skip,
            orderBy: {
                [sortBy]: sortOrder
            },
            include: {
                techician:true,
                user:true
            }
        })
    
        const totalOutagesCount = await prisma.outage.count({
            where: {
                AND: andConditions
            }
        })
    
    
        return {
            data: allOutages,
            meta: {
                page,
                limit,
                total: totalOutagesCount,
                totalPages: Math.ceil(totalOutagesCount / limit)
            }
        }
    
    
}

export const OutageService = {
    createOutageInDb,
    getAllOutageFromDb
}