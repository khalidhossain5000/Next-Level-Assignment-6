import { Router } from "express";
import { auth } from "../../../middlewares/checkAuth";
import { Role } from "../../../../generated/prisma/enums";

import { ZoneController } from "./zone.controller";
import { upload } from "../../../lib/multer";

const router = Router();
//create zone
router.post("/",auth(Role.ADMIN),upload.single("zoneImage"),ZoneController.createZone)

//get all zone for public route
router.get("/",ZoneController.getAllZone)


export const ZoneRoutes = router;