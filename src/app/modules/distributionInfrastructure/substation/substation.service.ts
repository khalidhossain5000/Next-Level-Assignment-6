import type{ SubstationWhereInput } from "../../../../generated/prisma/models"
import type{ IQuery } from "../../../interfaces/interface"
import  { prisma } from "../../../lib/prisma"
import type { ISubstationPayload, IUpdateSubstationPayload } from "./substation.interface"
import { AppError } from "../../../utils/AppError"
import httpStatus from "http-status"

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


//substion details get protected
const getSubstationDetails=async(substationId:string)=>{
  const substationDetails = await prisma.substation.findUnique({
        where: {
            id: substationId
        },
        include:
        {
            feeders:true,
            zone:true
        }
    })
    return substationDetails
}

const updateSubstation = async (
    substationId: string,
    payload: IUpdateSubstationPayload,
) => {
    const existingSubstation = await prisma.substation.findUnique({
        where: { id: substationId },
    });

    if (!existingSubstation) {
        throw new AppError(httpStatus.NOT_FOUND, "Substation not found");
    }

    if (payload.code && payload.code !== existingSubstation.code) {
        const substationWithSameCode = await prisma.substation.findUnique({
            where: { code: payload.code },
        });

        if (substationWithSameCode) {
            throw new AppError(httpStatus.CONFLICT, "Substation code already exists");
        }
    }

    if (payload.zoneId && payload.zoneId !== existingSubstation.zoneId) {
        const zone = await prisma.zone.findUnique({
            where: { id: payload.zoneId },
        });

        if (!zone) {
            throw new AppError(httpStatus.NOT_FOUND, "Zone not found");
        }
    }

    return prisma.substation.update({
        where: { id: substationId },
        data: payload,
        include: {
            zone: true,
            feeders: true,
        },
    });
};

export const SubstationService={
    createSubstation,
    getAllSubstationFromDb,
    getSubstationDetails,
    updateSubstation,
}