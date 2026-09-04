import type { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status"
import { ZoneService } from "./zone.service";
import { AppError } from "../../../utils/AppError";
import { createZoneZodSchema } from "./zone.validation";

const createZone = catchAsync(async (req: Request, res: Response) => {
    const zoneImageFile = req.file as Express.Multer.File | undefined

    const zodValidationResult = createZoneZodSchema.safeParse(JSON.parse(req.body.data))

    if (!zodValidationResult.success) {
        throw new AppError(httpStatus.BAD_REQUEST, zodValidationResult.error.issues[0].message);
    }

    const payload = zodValidationResult.data

    if (!zoneImageFile) throw new AppError(httpStatus.BAD_REQUEST, "Zone image is required please add a image")

    const result = await ZoneService.createZoneInDb(payload, zoneImageFile)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Zone created successfully",
        data: result,
    });
});

//get all zone with pagination search filter
const getAllZone = catchAsync(async (req: Request, res: Response) => {


    const { data, meta } = await ZoneService.getAllZoneFromDb(req.query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Zone Retrieved Successfully",
        data: data,
        meta: meta,
    });
});

//zone details 

const getZoneDetails = catchAsync(async (req: Request, res: Response) => {

    const zoneId = req.params.zoneId

    const result = await ZoneService.getZoneDetails(zoneId as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Zone Details Successfully",
        data: result,

    });
});


export const ZoneController = {
    createZone,
    getAllZone,
    getZoneDetails
}