import { Router } from "express";
import { auth } from "../../../middlewares/checkAuth";
import { Role } from "../../../../generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { ZoneValidation } from "./zone.validation";
import { ZoneController } from "./zone.controller";
import { upload } from "../../../lib/multer";

const router = Router();
//create zone
router.post("/",auth(Role.ADMIN),upload.single("zoneImage"),validateRequest(ZoneValidation.createZoneZodSchema),ZoneController.createZone)
export const ZoneRoutes = router;