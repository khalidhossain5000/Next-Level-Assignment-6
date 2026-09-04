import type { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status"
import { ZoneService } from "./zone.service";
import { AppError } from "../../../utils/AppError";

const createZone = catchAsync(async (req: Request, res: Response) => {
const zoneImageFile=req.file as Express.Multer.File | undefined
const payload = JSON.parse(req.body.data);

if(!zoneImageFile) throw new AppError(httpStatus.BAD_REQUEST,"Zone image is required please add a image")
   
const result=await ZoneService.createZoneInDb(payload,zoneImageFile )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile fetched successfully",
        data: result,
    });
});


export const ZoneController = {
    createZone
}