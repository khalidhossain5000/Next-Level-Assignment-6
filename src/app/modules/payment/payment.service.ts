//intiate payment and create payment

import axios from "axios";

import configuration from "../../config";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { PaymentStatus, Role } from "../../../generated/prisma/enums";

const createPaymentInDb = async (
  outageReportId: string,
  customerId: string
) => {
  // console.log(tenantId,'tenatn id from paymetn service')
  const transId = `TRX_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  //fetch customer who requested to pay
  const customer = await prisma.user.findUniqueOrThrow({
    where: 
    { id: customerId,
      role: Role.CUSTOMER
     },
  });
  //payment will be done if rental request stasus is approved
  const outageReport = await prisma.outage.findUniqueOrThrow({
    where: {
      id: outageReportId,
    },
    include:{
        user:true
    }
  });
  // checking ownership if this outage is added and  by current logged in user
  if (outageReport.userId !== customer.id)
    throw {
      statusCode: httpStatus.FORBIDDEN,
      name: "Forbidden",
      message:
        "You are not allowed to pay for this Outage since this is not you added.Pay for your own",
    };

    //checking if same current user already paid for this outage or not
 
  const existingPayment = await prisma.payment.findFirst({
    where: {
      outageReportId,
      customerId,
      status: PaymentStatus.COMPLETED,
    },
  });
  if (existingPayment)
    throw {
      statusCode: httpStatus.CONFLICT,
      name: "Conflict error",
      message: "You already paid for this outage report Wait for admin tech further step.",
    };

  //intialied paymetn
  const paymentData = {
    store_id: configuration.ssl_commerz_store_id,
    store_passwd: configuration.ssl_commerz_store_password,
    total_amount: rentalRequest.totalAmount,
    currency: "BDT",
    tran_id: transId,
    success_url: `${configuration.app_url}/api/payments/confirm?rentalRequestId=${rentalRequestId}&tranId=${transId}&status=success`,
    fail_url: `${configuration.app_url}/api/payments/confirm?rentalRequestId=${rentalRequestId}&tranId=${transId}&status=fail`,
    cancel_url: `${configuration.app_url}/api/payments/confirm?rentalRequestId=${rentalRequestId}&tranId=${transId}&status=cancel`,
    cus_name: `${user.firstName} ${user.lastName}`,
    cus_email: user.email,
    cus_add1: "N/A",
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: 1000,
    cus_country: "Bangladesh",
    // cus_phone: "01711111111",
    cus_fax: "01711111111",
  };
  //axios hittign the sslxomerz url
  const res = await axios.post(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    paymentData,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  const data = res.data;

  await prisma.payment.create({
    data: {
      transactionId: transId,
      provider: "SSL_Commerz",
      totalAmount: rentalRequest.totalAmount,
      status: PaymentStatus.PENDING,
      rentalRequestId,
    },
  });
  return { paymentGatewayUrl: data.GatewayPageURL };
};

//payment configm and verify payment that the payment is successfully done
const verifySslCommerzPayment = async (
  transId: string,
  status: string,
  val_id: string
) => {
  const response = await axios.post(
    `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${configuration.ssl_commerz_store_id}&store_passwd=${configuration.ssl_commerz_store_password}&format=json
`,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  const paymentData = response.data;

  if (paymentData.status === "VALID") {
    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUniqueOrThrow({
        where: {
          transactionId: transId,
        },
        include: {
          rentalRequest: true,
        },
      });

      await tx.payment.update({
        where: {
          transactionId: transId,
        },
        data: {
          status: PaymentStatus.COMPLETED,
        },
      });

      await tx.rentalRequest.update({
        where: {
          id: payment.rentalRequestId,
        },
        data: {
          status: RentalRequestStatus.ACTIVE,
        },
      });

      //set property stasus to booked

      await tx.properties.update({
        where: {
          id: payment.rentalRequest.propertyId,
        },
        data: {
          status: PropertyStatus.BOOKED,
        },
      });
    });
  } else if (
    paymentData.status === "FAILED" ||
    paymentData.status === "INVALID_TRANSACTION"
  ) {
    await prisma.payment.update({
      where: {
        transactionId: transId,
      },
      data: {
        status: PaymentStatus.FAILED,
      },
    });
  }

  return status;
};

//get  users payment history
const paymentHistoryFromDb = async (tenantId: string) => {
  const result = await prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId,
      },
    },
    include: {
      rentalRequest: true,
    },
  });
  console.log(result, "this is result");
  return result;
};

//get payment details
const paymentDetailsFromDb = async (id: string, tenantId: string) => {
  const result = await prisma.payment.findUniqueOrThrow({
    where: {
      id,
      rentalRequest: {
        tenantId,
      },
    },
    include: {
      rentalRequest: true,
    },
  });
  return result;
};

export const paymentServices = {
  createPaymentInDb,
  verifySslCommerzPayment,
  paymentHistoryFromDb,
  paymentDetailsFromDb,
};
