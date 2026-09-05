import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import httpStatus from "http-status"
import { PlannedOutageService } from "./planned-outage.service";

const createPlannedOutage = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body

    const result=await PlannedOutageService.createPlannedOutageInDb(payload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Planned Outage schedule created successfully",
        data: result,
    });
});

//get all planned outage

const getAllLoadShedding = catchAsync(async (req: Request, res: Response) => {



    const result = await LoadSheddingService.getAllLoadSheddingSchdeule(req.query)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All LoadShedding schedule Retrived successfully",
        data: result,
    });
});


//details

const getLoadSheddingDetails = catchAsync(async (req: Request, res: Response) => {

    const loadsheddingId = req.params.loadsheddingId

    const result = await LoadSheddingService.getLoadSheddingDetails(loadsheddingId as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Loadshedding Details Successfully",
        data: result,

    });
});

//update schdeule

const updateLoadSheddingSchedule = catchAsync(async (req: Request, res: Response) => {

    const loadsheddingId = req.params.loadsheddingId
    const payload = req.body
    const result = await LoadSheddingService.updateSchedule(payload, loadsheddingId as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Loadshedding Details Successfully",
        data: result,

    });
})


export const PlannedOutageController = {
    createPlannedOutage,
    getAllLoadShedding,
    getLoadSheddingDetails,
    updateLoadSheddingSchedule
}