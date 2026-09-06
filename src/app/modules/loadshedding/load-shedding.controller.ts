import type { Request, Response } from "express";
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


const getAllLoadShedding = catchAsync(async (req: Request, res: Response) => {

console.log(req.query,'LOAD SHEDING CONTROLLER HITTED');

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


export const LoadSheddingController = {
    createLoadShedding,
    getAllLoadShedding,
    getLoadSheddingDetails,
    updateLoadSheddingSchedule
}