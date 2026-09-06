/** biome-ignore-all lint/complexity/useLiteralKeys: <explanation> */
import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status"
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";
import { technicianProfileZodSchema } from "./technician-profile.validation";
import { TechnicianProfileService } from "./technician-profile.service";

const updateTechnicianProfile = catchAsync(async (req: Request, res: Response) => {
    const resume = req.file;

    if (!resume) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Resume is required"
        );
    }


    const zodValidationResult = technicianProfileZodSchema.safeParse(
        JSON.parse(req.body.data),
    );

    if (!zodValidationResult.success) {
        throw new AppError(httpStatus.BAD_REQUEST, zodValidationResult.error.issues[0].message);
    }

    const payload = zodValidationResult.data;
    const technicianUserId = req.user?.userId
    console.log(resume, "thisis the files in controller", payload, technicianUserId)

    const result = await TechnicianProfileService.updateTechnicicanProfileInDb(payload, resume, technicianUserId as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technicain profile is updated successfully",
        data: result,
    });
});


//update technican profile status like approve or reject by the admin

const profileApproval = catchAsync(async (req: Request, res: Response) => {
    const resume = req.file;

    if (!resume) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Resume is required"
        );
    }


    const zodValidationResult = technicianProfileZodSchema.safeParse(
        JSON.parse(req.body.data),
    );

    if (!zodValidationResult.success) {
        throw new AppError(httpStatus.BAD_REQUEST, zodValidationResult.error.issues[0].message);
    }

    const payload = zodValidationResult.data;
    const technicianUserId = req.user?.userId
    console.log(resume, "thisis the files in controller", payload, technicianUserId)

    const result = await TechnicianProfileService.updateTechnicicanProfileInDb(payload, resume, technicianUserId as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technicain profile is updated successfully",
        data: result,
    });
});


export const TechnicianProfileController = {
    updateTechnicianProfile,
    profileApproval
}