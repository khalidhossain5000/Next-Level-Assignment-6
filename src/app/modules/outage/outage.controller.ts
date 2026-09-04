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


    const { data, meta } = await    AreaService.getAllAreaFromDb(req.query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Area Retrieved Successfully",
        data: data,
        meta: meta,
    });
});

//zone detailss

const getAreaDetails = catchAsync(async (req: Request, res: Response) => {

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
    getAllArea,
    getAreaDetails
}