import  { PaymentStatus, Role } from "../../../generated/prisma/enums";
import type { PaymentWhereInput } from "../../../generated/prisma/models";
import type { IQuery } from "../../interfaces/interface";
import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status"
import type { IUpdateStatusPayload } from "./admin.interface";

const getAllUsersFromDb=async()=>{
    const result=await prisma.user.findMany({
        omit:{
            password:true
        },
        include:{
            reportedOutages:true,
            payments:true
        }
    })

    return result
}

//update status


const updateUserStatus = async (
  payload:IUpdateStatusPayload
) => {
  const targetUser = await prisma.user.findUnique({
    where: {
      id: payload.targetUserId,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!targetUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found"
    );
  }

  // Admin cannot ban/unban another admin
  if (targetUser.role === Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Admin cannot change another admins status"
    );
  }

  // Already in requested status
  if (targetUser.status === payload.status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is already ${ payload.status}`
    );
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: payload.targetUserId,
    },
    data: {
      status:payload.status,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};


//get all technician data


const getAllTechnicanProfileFromDb=async()=>{
    const result=await prisma.user.findMany({
        where:{
            role:Role.TECHNICIAN
        },
         omit:{
                password:true
            },
        include:{
           
            technicianProfile:true,
            assignedOutages:true,

        }
    })

    return result
}


//all payment record


const getAllPaymentRecord=async(query:IQuery)=>{
 const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"


    const andConditions: PaymentWhereInput[] = []


    //Searching
    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    transactionId: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                }
                

            ],
        });
    }



    if (query.status) {
        andConditions.push({
            status: query.status as PaymentStatus,
        });
    }


    const allPayments = await prisma.payment.findMany({
        where: {
            AND: andConditions.length > 0 ? andConditions : undefined
        },
        take: limit,
        skip: skip,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            customer:{
                omit:{
                    password:true
                }
            },
            outage:true

        }
    })

    const totalPaymentsCount = await prisma.payment.count({
        where: {
            AND: andConditions
        }
    })


    return {
        data: allPayments,
        meta: {
            page,
            limit,
            total: totalPaymentsCount,
            totalPages: Math.ceil(totalPaymentsCount / limit)
        }
    }
}




export const AdminService = {
    getAllUsersFromDb,
    updateUserStatus,
    getAllTechnicanProfileFromDb,
    getAllPaymentRecord
}