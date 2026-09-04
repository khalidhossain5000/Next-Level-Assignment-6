import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { LoadSheddingService } from "./load-shedding.service";
import httpStatus from "http-status"
const createLoadShedding = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body


    const result = await LoadSheddingService.createLoadSheddingScheduleInDb(payload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "LoadShedding schedule created successfully",
        data: result,
    });
});




export const LoadSheddingController = {
createLoadShedding
}