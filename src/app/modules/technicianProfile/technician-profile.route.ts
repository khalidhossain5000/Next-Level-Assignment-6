import { Router } from "express";

import { TechnicianProfileController } from "./technician-profile.controller";
import { auth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";


const router = Router();

//patch to update technican profile

router.patch("/", auth(Role.TECHNICIAN), upload.single("resume"),TechnicianProfileController.updateTechnicianProfile)



//APPROVE TECH PROFILE UPDATE API FOR ADMIN ONLY


router.patch("/:tecnicianId/update-status",auth(Role.ADMIN))










export const TechnicianRoutes = router;