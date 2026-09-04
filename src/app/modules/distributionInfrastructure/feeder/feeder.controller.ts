import type { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { SubstationService } from "./substation.service";
import httpStatus from "http-status"
import { sendResponse } from "../../../utils/sendResponse";

const createSubstation = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const result = await SubstationService.createSubstation(payload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Substation created successfully",
        data: result,
    });
});


//get all zone with pagination search filter
const getAllSubstation = catchAsync(async (req: Request, res: Response) => {


    const { data, meta } = await SubstationService.getAllSubstationFromDb(req.query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Substation Retrieved Successfully",
        data: data,
        meta: meta,
    });
});

//zone details 

const getSubstationDetails = catchAsync(async (req: Request, res: Response) => {

    const substationId = req.params.substationId

    const result = await SubstationService.getSubstationDetails(substationId as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Zone Details Successfully",
        data: result,

    });
});


export const SubstationController = {
    createSubstation,
    getAllSubstation,
    getSubstationDetails
}