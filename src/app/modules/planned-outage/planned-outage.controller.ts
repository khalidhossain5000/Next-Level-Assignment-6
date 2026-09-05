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

const getAllPlannedOutageSchdeule = catchAsync(async (req: Request, res: Response) => {



    const result = await PlannedOutageService.getAllPlannedOutage(req.query)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Planned Outage schedule Retrived successfully",
        data: result,
    });
});


//details

const getPlannedOutageDetails = catchAsync(async (req: Request, res: Response) => {

    const plannedOutageId = req.params.plannedOutageId

    const result = await PlannedOutageService.plannedOutageDetails(plannedOutageId as string)

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
    getAllPlannedOutageSchdeule,
    getPlannedOutageDetails,
    updateLoadSheddingSchedule
}