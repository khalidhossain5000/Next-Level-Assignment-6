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
router.get("/",auth(Role.ADMIN),OutageController.getAllOutageForAdminManage)

//-- get  unexpected outage details (WILL DONE LATER IF NEEDED)



//--get my (currentuser addeda ll ) outage

router.get("/",auth(Role.CUSTOMER),OutageController.getCurrentUserAddedOutages)
//--update outage

//--assign technician to solve this outage admin only
router.patch("/:outageId/assign-technician",auth(Role.ADMIN),OutageController.assignTechnicianToReportedOutage)


//update outage status accoding to flow
router.patch(
  "/:outageId/status",
  auth(Role.ADMIN, Role.TECHNICIAN),
  OutageController.updateOutageStatus
);



export const OutageRoutes = router;
