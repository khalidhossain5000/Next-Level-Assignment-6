import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "../../../middlewares/checkAuth";
import { validateRequest } from "../../../middlewares/validateRequest";
import { feederValidation } from "./feeder.validation";
import { FeederController } from "./feeder.controller";

const router = Router();


router.post("/",auth(Role.ADMIN),validateRequest(feederValidation.createFeederZodSchema),FeederController.createFeeder)

//update feeder details
router.patch("/:feederId",auth(Role.ADMIN),validateRequest(feederValidation.updateFeederZodSchema),FeederController.updateFeeder)


//get all substion public
router.get("/",FeederController.getAllFeeder)


router.get("/:feederId",FeederController.getFeederDetails)



export const FeederRoutes = router;
