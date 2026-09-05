import type { Request, Response } from "express";
import httpStatus from "http-status"

import { OutageService } from "./outage.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Role } from "../../../generated/prisma/enums";

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



//outage status udpate  controller

const updateOutageStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { outageId } = req.params;
    const { status } = req.body;
    const userId=req.user?.userId;
    const userRole=req.user?.role
    const result = await OutageService.updateOutageStatusInDb(
      outageId as string,
      status,
     userId as string,
     userRole as Role
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Outage status updated successfully",
      data: result,
    });
  }
);


export const OutageController = {
    createOutage,
    getAllOutageForAdminManage,
    getCurrentUserAddedOutages,
    assignTechnicianToReportedOutage,
    updateOutageStatus
    
}