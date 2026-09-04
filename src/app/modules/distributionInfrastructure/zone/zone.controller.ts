import type { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status"
import { ZoneService } from "./zone.service";

const createZone = catchAsync(async (req: Request, res: Response) => {
    
const payload=req.body
   
const result=await ZoneService.createZoneInDb(payload)

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