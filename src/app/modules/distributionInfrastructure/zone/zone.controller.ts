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


export const ZoneController = {
    createZone
}