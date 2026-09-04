import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status"
import { sendResponse } from "../../utils/sendResponse";

const getMe = catchAsync(async (req: Request, res: Response) => {



	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User profile fetched successfully",
		data: null,
	});
});




export const TechnicianProfileController={

}