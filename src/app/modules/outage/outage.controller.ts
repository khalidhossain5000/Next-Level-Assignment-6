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


//get all outages with pagination search filter admin
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


//get all outage for current logged user which he added

const getCurrentUserAddedOutages = catchAsync(async (req: Request, res: Response) => {

    const userId=req.user?.userId

    const result=await OutageService.getCurrentUserAddedAllOutagesFromDb(userId as string)


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Outages Retrieved Successfully",
        data: result,
       
    });
});

const assignTechnicianToReportedOutage = catchAsync(
  async (req: Request, res: Response) => {
    const { outageId } = req.params;
    const { technicianId } = req.body;

    const result = await OutageService.assignTechnician(
      outageId as string,
      technicianId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Technician assigned successfully",
      data: result,
    });
  }
);

export const OutageController = {
    createOutage,
    getAllOutageForAdminManage,
    getCurrentUserAddedOutages,
    assignTechnicianToReportedOutage
    
}