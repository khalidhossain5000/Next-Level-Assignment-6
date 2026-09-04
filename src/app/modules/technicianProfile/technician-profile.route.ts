import { Router } from "express";

import { TechnicianProfileController } from "./technician-profile.controller";
import { auth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

//patch to update technican profile

router.patch("/",auth(Role.TECHNICIAN),TechnicianProfileController.updateTechnicianProfile)

export const TechnicianRoutes = router;