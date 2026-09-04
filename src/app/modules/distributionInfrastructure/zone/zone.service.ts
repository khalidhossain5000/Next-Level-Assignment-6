
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../utils/AppError";
import httpStatus from "http-status"
import type { ICreateZonePayload } from "./zone.interface";






const createZoneInDb=async(payload:ICreateZonePayload)=>{
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
}


export const ZoneService={
    createZoneInDb
}