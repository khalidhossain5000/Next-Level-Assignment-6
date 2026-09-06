import {
  OutageStatus,
  Role,
  TechnicianProfileStatus,
  TechnicianStatus,
  UserStatus,
} from "../../../generated/prisma/enums";
import type { OutageWhereInput } from "../../../generated/prisma/models";
import type { IQuery } from "../../interfaces/interface";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IOutagePayload } from "./outage.interface";
import httpStatus from "http-status";
export const createOutageInDb = async (
  payload: IOutagePayload,
  userId: string
) => {
  const { cause, description,areaId } = payload;

  const outageCreatedResult = await prisma.outage.create({
    data: {
      cause,
      description,
      userId,
      areaId
    },
  });
  return outageCreatedResult;
};

//get all outage fora dmin manage

const getAllOutageFromDb = async (query: IQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andConditions: OutageWhereInput[] = [];
andConditions.push({
  isDeleted: false,
});
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
      AND: andConditions.length > 0 ? andConditions : undefined,
    },
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      techician: true,
      user: true,
    },
  });

  const totalOutagesCount = await prisma.outage.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: allOutages,
    meta: {
      page,
      limit,
      total: totalOutagesCount,
      totalPages: Math.ceil(totalOutagesCount / limit),
    },
  };
};

//get current user added all outages

const getCurrentUserAddedAllOutagesFromDb = async (userId: string) => {
  const currentUserOutages = await prisma.outage.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    include: {
      techician: true,
      user: true,
    },
  });

  return currentUserOutages;
};

//assign technician service

const assignTechnician = async (outageId: string, technicianId: string) => {
  //s-1 check if reported outage exist or not
  const ifOutageExist = await prisma.outage.findUnique({
    where: {
      id: outageId,
    },
  });
  if (!ifOutageExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Outage not found");
  }
//is outage deleted

  if (ifOutageExist.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Outage is deleted");
  }




  //s-2 check if outage is already cancelled or resolved

  if (
    ifOutageExist.status === OutageStatus.RESTORED ||
    ifOutageExist.status === OutageStatus.CANCELLED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Technician cannot be assigned to a restored or cancelled outage"
    );
  }

  //s-3 now need to if given techcian id is exist and has techncian user role

  const technician = await prisma.user.findUnique({
    where: {
      id: technicianId,
    },
    include: {
      technicianProfile: true,
    },
  });

  if (!technician) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician not found");
  }

  if (technician.role !== Role.TECHNICIAN) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Selected user is not a technician"
    );
  }

  //s-4 techncinan account must be active not banned

  if (technician.status === UserStatus.BAN) {
    throw new AppError(httpStatus.FORBIDDEN, "This technician is banned");
  }

  //s-5 technican profile must exist -->

  if (!technician.technicianProfile) {
    throw new AppError(httpStatus.BAD_REQUEST, "Technician profile not found");
  }

  // 6. Technician profile must be approved
  if (
    technician.technicianProfile.technicianvProfileVerificationStatus !==
    TechnicianProfileStatus.APPROVED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Technician profile is not approved"
    );
  }

  //s-7 technican must be availble to assign

  if (
    technician.technicianProfile.availability !== TechnicianStatus.AVAILABLE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Technician is currently unavailable"
    );
  }

  // 8. Check if already assigned to this outage
  if (ifOutageExist.technicianId === technicianId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This technician is already assigned to the outage"
    );
  }

  //s-9 finally we can assign the technician

  const transactionResult = await prisma.$transaction(async (tx) => {
    const updatedResult = await tx.outage.update({
      where: {
        id: outageId,
      },
      data: {
        technicianId,
        status: OutageStatus.ASSIGNED

      },
    });

    await tx.technicianProfile.update({
      where: {
        userId: technicianId,
      },
      data: {
        availability: TechnicianStatus.BUSY,
      },
    });

    return updatedResult;
  });

  return transactionResult;
};

//update outage status in db

const updateOutageStatusInDb = async (
  outageId: string,
  status: OutageStatus,
  userId: string,
  userRole: Role
) => {
  //main goal to udpate status of the outage accoridng to flow

  //s-1 findoutage if it is exist

  const outage = await prisma.outage.findUnique({
    where: {
      id: outageId,
    },
    select: {
      id: true,
      status: true,
      technicianId: true,
    },
  });

  if (!outage) {
    throw new AppError(httpStatus.NOT_FOUND, "Outage not found");
  }

  //s-2 need to check if requested status is already current status of the outage or not

  if (outage.status === status) {
    throw new AppError(httpStatus.BAD_REQUEST, `Outage is already ${status}`);
  }

  //s-3 REPORTED AND ACKNOWLEDGE only admin can update this status

  if (status === OutageStatus.ACKNOWLEDGED) {
    if (userRole !== Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only admin can acknowledge an outage"
      );
    }

    if (outage.status !== OutageStatus.REPORTED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Only a reported outage can be acknowledged"
      );
    }

    const updatedOutage = await prisma.outage.update({
      where: {
        id: outageId,
      },
      data: {
        status: OutageStatus.ACKNOWLEDGED,
        acknowledgedAt: new Date(),
      },
    });

    return updatedOutage;
  }

  //s-4 now from assigned to in progess only technican can do

  if (status === OutageStatus.IN_PROGRESS) {
    if (userRole !== Role.TECHNICIAN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only technician can start outage work"
      );
    }

    if (outage.status !== OutageStatus.ASSIGNED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Only an assigned outage can be moved to in progress"
      );
    }
    //can not update other assigned task need to be his own
    if (outage.technicianId !== userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not assigned to this outage"
      );
    }
    const updatedOutage = await prisma.outage.update({
      where: {
        id: outageId,
      },
      data: {
        status: OutageStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });

    return updatedOutage;
  }

  // 5. IN_PROGRESS -> RESTORED only technican can update as useall

  if (status === OutageStatus.RESTORED) {
    if (userRole !== Role.TECHNICIAN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only technician can restore an outage"
      );
    }

    if (outage.status !== OutageStatus.IN_PROGRESS) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Only an in-progress outage can be restored"
      );
    }

    if (outage.technicianId !== userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not assigned to this outage"
      );
    }
    const transactionResult = await prisma.$transaction(async (tx) => {
      const updatedOutage = await tx.outage.update({
        where: {
          id: outageId,
        },
        data: {
          status: OutageStatus.RESTORED,
          restoredAt: new Date(),
        },
      });

      await tx.technicianProfile.update({
        where: {
          userId: userId,
        },
        data: {
          availability: TechnicianStatus.AVAILABLE,
        },
      });

      return updatedOutage;
    });

    return transactionResult;
  }
  // 6. Any unsupported status transition
  throw new AppError(
    httpStatus.BAD_REQUEST,
    `Invalid outage status transition to ${status}`
  );
};





//delete outage


const deleteOutageFromDb=async(outageId:string,requestedUserId:string)=>{

//--check if outage exist or not

  const outage = await prisma.outage.findUnique({
    where: {
      id: outageId,
    },
  });

  if (!outage) {
    throw new AppError(httpStatus.NOT_FOUND, "Outage not found");
  }


//can not delte other outage 
  if (outage.userId !== requestedUserId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to delete this outage"
    );
  }

//if already deleted
  if (outage.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Outage is already deleted");
  }

  const deletedOutage = await prisma.outage.update({
    where: {
      id: outageId,
    },
    data: {
      isDeleted: true,
    },
  });

  return deletedOutage;





}











export const OutageService = {
  createOutageInDb,
  getAllOutageFromDb,
  getCurrentUserAddedAllOutagesFromDb,
  assignTechnician,
  updateOutageStatusInDb,
  deleteOutageFromDb
};
