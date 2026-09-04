import { SubstationWhereInput } from "../../../../generated/prisma/models"
import { IQuery } from "../../../interfaces/interface"
import { prisma } from "../../../lib/prisma"
import type { ISubstationPayload } from "./substation.interface"

const createSubstation=async(payload:ISubstationPayload)=>{
    const {name,code,capacity,location,zoneId} =payload


    const createdSubstationResult=await prisma.substation.create({
        data:{
            name,
            capacity,
            code,
            location,
            zoneId
            
        },
        include:{
            zone:true,
            feeders:true
        }
    })
return createdSubstationResult

}

//get all substion ( not adding  filter)

const getAllSubstationFromDb=async(query:IQuery)=>{
     const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"


    
        const andConditions: SubstationWhereInput[] = []
    
    
        //Searching
        if (query.searchTerm) {
            andConditions.push({
                OR: [
                    { name: { contains: query.searchTerm, mode: "insensitive" } },
                    { code: { contains: query.searchTerm, mode: "insensitive" } },
                    {
                        location: {
                            contains: query.searchTerm,
                            mode: "insensitive",
                        },
                    },
    
                ],
            });
        }



    const allSubstation = await prisma.substation.findMany({
        where: {
            AND: andConditions.length > 0 ? andConditions : undefined
        },
        take: limit,
        skip: skip,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            zone:true,
            feeders:true
        }
    })

    const totalZoneCount = await prisma.substation.count({
        where: {
            AND: andConditions
        }
    })


    return {
        data: allSubstation,
        meta: {
            page,
            limit,
            total: totalZoneCount,
            totalPages: Math.ceil(totalZoneCount / limit)
        }
    }











}

export const SubstationService={
    createSubstation,
    getAllSubstationFromDb
}