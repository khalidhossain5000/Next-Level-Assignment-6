import { Router } from "express";
import { auth } from "../../../middlewares/checkAuth";
import { Role } from "../../../../generated/prisma/enums";

import { ZoneController } from "./zone.controller";
import { upload } from "../../../lib/multer";

const router = Router();
//create zone
router.post("/",auth(Role.ADMIN),upload.single("zoneImage"),ZoneController.createZone)

//update zone details or update its image
router.patch("/:zoneId",auth(Role.ADMIN),upload.single("zoneImage"),ZoneController.updateZone)

//get all zone for public route
router.get("/",ZoneController.getAllZone)
router.get("/:zoneId",ZoneController.getZoneDetails)


export const ZoneRoutes = router;