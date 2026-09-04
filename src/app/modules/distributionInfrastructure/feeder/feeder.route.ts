import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "../../../middlewares/checkAuth";

const router = Router();


router.post("/",auth(Role.ADMIN),validateRequest(substationValidation.createSubstationZodSchema),SubstationController.createSubstation)


//get all substion public
router.get("/",SubstationController.getAllSubstation)

//get details protected need lgoin

router.get("/:substationId",auth(Role.CUSTOMER,Role.TECHNICIAN,Role.ADMIN),SubstationController.getSubstationDetails)



export const FeederRoutes = router;
