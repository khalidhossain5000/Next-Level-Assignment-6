import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { OutageController } from "./outage.controller";
import { outageValidation } from "./outage.validation";

const router = Router();

//--create unexpected outage for customer
// createOutageZodSchema
router.post("/", auth(Role.CUSTOMER), validateRequest(outageValidation.createOutageZodSchema), OutageController.createOutage)
//--get all unexpected outage for admin manage
router.get("/", auth(Role.ADMIN), OutageController.getAllOutageForAdminManage)


//--get my (currentuser addeda ll ) outage

router.get("/", auth(Role.CUSTOMER), OutageController.getCurrentUserAddedOutages)
//--get outage details
router.get("/:outageId", auth(Role.ADMIN, Role.CUSTOMER), OutageController.getOutageDetails)

//--update outage details for the reporting customer only
router.patch("/:outageId", auth(Role.CUSTOMER), validateRequest(outageValidation.updateOutageZodSchema), OutageController.updateOutage)

//--assign technician to solve this outage admin only
router.patch("/:outageId/assign-technician", auth(Role.ADMIN), OutageController.assignTechnicianToReportedOutage)


//update outage status accoding to flow
router.patch(
  "/:outageId/status",
  auth(Role.ADMIN, Role.TECHNICIAN),
  OutageController.updateOutageStatus
);

//delete outage

router.delete("/:outageId", auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER), OutageController.deleteOutage)

export const OutageRoutes = router;
