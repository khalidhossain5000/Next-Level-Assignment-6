import { Router } from "express";
import { auth } from "../../../middlewares/checkAuth";
import { Role } from "../../../../generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { substationValidation } from "./substation.validation";
import { SubstationController } from "./substation.controller";

const router = Router();

router.post("/",auth(Role.ADMIN),validateRequest(substationValidation.createSubstationZodSchema),SubstationController.createSubstation)
export const SubstationRoutes = router;
