import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../utils/AppError";
import httpStatus from "http-status";
import type { ICreateZonePayload } from "./zone.interface";
import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../../lib/cloudinary";

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

export const ZoneService = {
  createZoneInDb,
};