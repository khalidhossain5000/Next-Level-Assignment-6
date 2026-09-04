import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../utils/AppError";
import httpStatus from "http-status";
import type { ICreateZonePayload } from "./zone.interface";
import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../../lib/cloudinary";
import { IQuery } from "../../../interfaces/interface";
import { ZoneWhereInput } from "../../../../generated/prisma/models";
import { ZoneStatus } from "../../../../generated/prisma/enums";

const createZoneInDb = async (
  payload: ICreateZonePayload,
  zoneImageFile: Express.Multer.File
) => {
  const existingZoneCode = await prisma.zone.findUnique({
    where: {
      code: payload.code,
    },
  });

  if (existingZoneCode) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Zone code already exists"
    );
  }

  const { name, code, description, status } = payload;

  const zoneImageUploadResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            if (!result) {
              return reject(
                new AppError(
                  httpStatus.INTERNAL_SERVER_ERROR,
                  "No result returned from Cloudinary"
                )
              );
            }

            resolve(result);
          }
        )
        .end(zoneImageFile.buffer);
    }
  );

  const zoneResult = await prisma.zone.create({
    data: {
      name,
      code,
      description,
      status,
      zoneImageUrl:zoneImageUploadResult.secure_url,
      zoneImagePublicId:zoneImageUploadResult.public_id
    },
    include: {
      substations: true,
    },
  });

  return zoneResult;
};



//get all zone public route this is

const getAllZoneFromDb=async(query: IQuery)=>{
    const limit = query.limit ? Number(query.limit) : 10;
	const page = query.page ? Number(query.page) : 1;
	const skip = (page - 1) * limit;
	const sortBy = query.sortBy ? query.sortBy : "createdAt";
	const sortOrder = query.sortOrder ? query.sortOrder : "desc"


	const andConditions: ZoneWhereInput[] = []


	//Searching
	if (query.searchTerm) {
		andConditions.push({
			OR: [
				{ name: { contains: query.searchTerm, mode: "insensitive" } },
				{ code: { contains: query.searchTerm, mode: "insensitive" } },
				{
					description: {
						contains: query.searchTerm,
						mode: "insensitive",
					},
				},
				
			],
		});
	}



	//filtering
	if (query.code) {
		andConditions.push({
			code: { equals: query.code, mode: "insensitive" },
		});
	}

	if (query.status) {
		andConditions.push({
			status: query.status as ZoneStatus,
		});
	}


const getAllZone=await prisma.zone.findMany({
where:{
    AND:andConditions.length >0 ? andConditions : undefined
}
})












}







export const ZoneService = {
  createZoneInDb,
};