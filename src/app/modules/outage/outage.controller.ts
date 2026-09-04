import type { Request, Response } from "express";
import httpStatus from "http-status"

import { OutageService } from "./outage.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createOutage = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body

    const userId=req.user?.userId

    const result = await OutageService.createOutageInDb(payload,userId as string)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Unexpected Outage created successfully",
        data: result,
    });
});


//get all zone with pagination search filter admin
const getAllOutageForAdminManage = catchAsync(async (req: Request, res: Response) => {


    const { data, meta } = await OutageService.getAllOutageFromDb(req.query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Outages Retrieved Successfully",
        data: data,
        meta: meta,
    });
});

//zone detailss

const getOutageDetails = catchAsync(async (req: Request, res: Response) => {

    const areaId = req.params.areaId

    const result = await AreaService.getAreaDetails(areaId as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Area Details Retrieved Successfully",
        data: result,

    });
});


export const OutageController = {
    createOutage,
    getAllOutageForAdminManage,
    getAreaDetails
}