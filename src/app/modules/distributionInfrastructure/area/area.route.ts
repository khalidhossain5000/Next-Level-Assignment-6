import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "../../../middlewares/checkAuth";
import { validateRequest } from "../../../middlewares/validateRequest";
import { areaValidation } from "./area.validation";
import { AreaController } from "./area.controller";


const router = Router();


router.post("/",auth(Role.ADMIN),validateRequest(areaValidation.createAreaZodSchema),AreaController.createArea)


//get all substion public
router.get("/",AreaController.getAllArea)

//get details protected need lgoin

router.get("/:areaId",auth(Role.CUSTOMER,Role.TECHNICIAN,Role.ADMIN),AreaController.getAreaDetails)



export const FeederRoutes = router;
