import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";
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


//verify otp and send accesstoken refresh token
const verifyUserEmail = catchAsync(async (req: Request, res: Response) => {
	console.log("user  hited controller", req.body);

	//zod sanitization

	const payload = req.body;

	const result = await authServices.verifyOtpAndCreateUser(payload)

	const { accessToken, refreshToken, createdUser } = result;
	//cookie set
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});
	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Patient registered successfully",
		data: { accessToken, refreshToken, createdUser },
	});
});





//login user

const loginUser=catchAsync(async (req: Request, res: Response) => {
	console.log("register patient hited controller", req.body);

	//zod sanitization

	const payload = req.body;

	const {accessToken,refreshToken}= await authServices.loginUser(payload)

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Login successfull",
		data: {
			accessToken,
			refreshToken
		},
	});
})

//refresh token to get new accesstoken


const refreshToken = catchAsync(async (req: Request, res: Response) => {
	if (!req.cookies.refreshToken) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is missing");
	}
	const result = await authServices.refreshToken(req.cookies.refreshToken);
	const { accessToken, refreshToken: newRefreshToken } = result;

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	});
	res.cookie("refreshToken", newRefreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "New tokens generated successfully",
		data: {
			accessToken,
			refreshToken: newRefreshToken,
		},
	});
});











export const authController={
    registerUser,
    verifyUserEmail,
	loginUser,
	refreshToken
}