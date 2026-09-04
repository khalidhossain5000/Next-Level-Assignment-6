import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "../../../middlewares/checkAuth";
import { validateRequest } from "../../../middlewares/validateRequest";
import { feederValidation } from "./feeder.validation";
import { FeederController } from "./feeder.controller";

const router = Router();


router.post("/",auth(Role.ADMIN),validateRequest(feederValidation.createFeederZodSchema),FeederController.createFeeder)


//get all substion public
router.get("/",FeederController.getAllFeeder)

//get details protected need lgoin

router.get("/:feederId",auth(Role.CUSTOMER,Role.TECHNICIAN,Role.ADMIN),FeederController.getFeederDetails)



export const FeederRoutes = router;
