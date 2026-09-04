import type { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import httpStatus from "http-status"
import { sendResponse } from "../../../utils/sendResponse";
import { AreaService } from "./area.service";

const createArea = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const result = await    AreaService.createAreaInDb(payload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Area created successfully",
        data: result,
    });
});


//get all zone with pagination search filter
const getAllArea = catchAsync(async (req: Request, res: Response) => {


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


export const AreaController = {
    createArea,
    getAllArea,
    getAreaDetails
}