import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { AdminController } from "./admin.controller";

const router = Router();

//-- get all users with search filter to manage theme
router.get("/users",auth(Role.ADMIN),AdminController.getAllUsers)

// -- update users status like ban unban

router.patch("/users/:userId",auth(Role.ADMIN),AdminController.updateUserStatus)

// -- get all technician to manage 

router.get("/technician",auth(Role.ADMIN),AdminController.getAllTechnicanUserData)



// -- get all payment record with search filter pagination

router.get("/payment-record",auth(Role.ADMIN),AdminController.getAllPaymentRecord)










export const AdminRoutes = router;
