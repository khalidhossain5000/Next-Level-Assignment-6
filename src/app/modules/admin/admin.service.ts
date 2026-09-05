import { Role, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status"

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
  userId: string,
  status: UserStatus
) => {
  const targetUser = await prisma.user.findUnique({
    where: {
      id: userId,
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
  if (targetUser.status === status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is already ${status}`
    );
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
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







export const AdminService = {
    getAllUsersFromDb,
    updateUserStatus,
    getAllTechnicanProfileFromDb
}