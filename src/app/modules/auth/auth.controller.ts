import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
const registerUser=catchAsync(async (req: Request, res: Response) => {
	console.log("register patient hited controller", req.body);

	//zod sanitization

	const payload = req.body;

	await authServices.registerUserInDb(payload)

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Registration successfull otp send to verify email now verify it",
		data: null,
	});
})


export const authController={
    registerUser
}