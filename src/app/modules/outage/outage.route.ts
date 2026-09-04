import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { OutageController } from "./outage.controller";
import { outageValidation } from "./outage.validation";

const router = Router();

//--create unexpected outage for customer
// createOutageZodSchema
router.post("/",auth(Role.CUSTOMER),validateRequest(outageValidation.createOutageZodSchema),OutageController.createOutage)
//--get all unexpected outage for admin manage

//-- get  unexpected outage details



//--get my (currentuser addeda ll ) outage


//--update outage

//--assign technician to solve this outage admin only
export const OutageRoutes = router;
