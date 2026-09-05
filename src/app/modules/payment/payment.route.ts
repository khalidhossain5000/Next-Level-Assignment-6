import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


//post create payment
router.post("/create",auth(Role.CUSTOMER),paymentController.createPayment)


//payment confirm ssl
router.post("/confirm",paymentController.verifySslCommerzPayment)


//get payment users history
router.get("/",auth(Role.CUSTOMER),paymentController.getUsersPaymentHistory)


//get payment details
router.get("/:id",auth(Role.CUSTOMER,Role.ADMIN),paymentController.getPaymentDetails)


export const PaymentRoutes = router;
