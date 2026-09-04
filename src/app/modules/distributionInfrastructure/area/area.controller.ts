import type { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import httpStatus from "http-status"
import { sendResponse } from "../../../utils/sendResponse";

const createFeeder = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const result = await    (payload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Feeder created successfully",
        data: result,
    });
});


//get all zone with pagination search filter
const getAllFeeder = catchAsync(async (req: Request, res: Response) => {


    const { data, meta } = await FeederService.getAllFeederFromDb(req.query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Feeder Retrieved Successfully",
        data: data,
        meta: meta,
    });
});

//zone details 

const getFeederDetails = catchAsync(async (req: Request, res: Response) => {

    const feederId = req.params.feederId

    const result = await FeederService.getFeederDetails(feederId as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Feeder Details Retrieved Successfully",
        data: result,

    });
});


export const FeederController = {
    createFeeder,
    getAllFeeder,
    getFeederDetails
}