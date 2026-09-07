/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AnalyticsServices } from "./analytics.service";

const getCustomerAnalytics = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const result = await AnalyticsServices.getCustomerAnalyticsReport(userId as string)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Customer Analytics Retrieved Successfully",
        data: result,
    });
});

const getTechnicianAnalytics = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const result = await AnalyticsServices.getTechnicianAnalyticsReport(userId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technician Analytics Retrieved Successfully",
        data: result,
    });
});

const getAdminAnalytics = catchAsync(async (req: Request, res: Response) => {
    const result = await AnalyticsServices.getAdminAnalyticsReport();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Analytics Retrieved Successfully",
        data: result,
    });
});

export const AnalyticsController = {
    getCustomerAnalytics,
    getTechnicianAnalytics,
    getAdminAnalytics,
};