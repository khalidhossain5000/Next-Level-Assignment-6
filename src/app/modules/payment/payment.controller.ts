// POST	/api/payments/create	Create a payment intent/session for an approved rental
// POST	/api/payments/confirm	Confirm/verify payment (webhook or callback)
// GET	/api/payments	Get user's payment history
// GET	/api/payments/:id	Get payment details

import type { NextFunction, Request, Response } from "express";

import httpsStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";
import config from "../../config";

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const outageReportId = req.body.outageReportId;
  
    const customerId = req.user?.userId;
    const result = await paymentServices.createPaymentInDb(
      outageReportId,
      customerId as string,
    );
    sendResponse(res, {
      statusCode: httpsStatus.CREATED,
      success: true,
      message: "Payment is  created for reported outage",
      data: result,
    });
  },
);

//payment confirm cotorler

const verifySslCommerzPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
  
    const {  tranId, status } = req.query;

    const val_id = req.body.val_id;


    await paymentServices.verifySslCommerzPayment(
      tranId as string,
      status as string,
      val_id,
    );

    if (status === "success") {
      return res.redirect(`${config.payment_result_redirect_base_url}/success.html`);
    }

    if (status === "fail") {
      return res.redirect(`${config.payment_result_redirect_base_url}/failed.html`);
    }

    return res.redirect(`${config.payment_result_redirect_base_url}/cancel.html`);
  },
);

//get users payment history

const getCustomersPaymentHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.userId;
    const result = await paymentServices.paymentHistoryFromDb(
      customerId as string,
    );
    sendResponse(res, {
      statusCode: httpsStatus.OK,
      success: true,
      message: "Your all payment history is retrived successfully",
      data: result,
    });
  },
);

const getPaymentDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params?.paymentId
  const customerId = req.user?.userId;
    const result = await paymentServices.paymentDetailsFromDb(
      paymentId as string,
      customerId as string,
    );
    sendResponse(res, {
      statusCode: httpsStatus.OK,
      success: true,
      message: "Your payment details is retrived successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createPayment,
  verifySslCommerzPayment,
  getCustomersPaymentHistory,
  getPaymentDetails,
};