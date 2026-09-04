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


export const SubstationController = {
    createSubstation
}