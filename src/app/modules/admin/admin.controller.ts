import type { Request,Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status"
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {


  const result = await AdminService.getAllUsersFromDb()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Users Data fetched successfully",
    data: result,
  });
});

//update status ban or unban


const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const status=req.body.status
    const targetUserId=req.params.userId

  const result = await AdminService.updateUserStatus(targetUserId as string,status)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});





//get all technicain profiel

const getAllTechnicanUserData = catchAsync(async (req: Request, res: Response) => {


  const result = await AdminService.getAllTechnicanProfileFromDb()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Technician Users Data fetched successfully",
    data: result,
  });
});



//get all payment record


const getAllPaymentRecord = catchAsync(async (req: Request, res: Response) => {


  const result = await AdminService.getAllTechnicanProfileFromDb()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Payment record Data fetched successfully",
    data: result,
  });
});



export const AdminController ={
    getAllUsers,
    updateUserStatus,
    getAllTechnicanUserData,
    getAllPaymentRecord
}