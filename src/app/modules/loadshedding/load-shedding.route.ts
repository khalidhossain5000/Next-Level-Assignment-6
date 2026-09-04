import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { loadSheddingValidation } from "./load-shedding.validation";
import { LoadSheddingController } from "./load-shedding.controller";

const router = Router();

//--create load shedding schedule for admin only

router.post("/",auth(Role.ADMIN),validateRequest(loadSheddingValidation.createLoadSheddingZodSchema),LoadSheddingController.createLoadShedding)

//--get all load shedding scheudle this will be public route

router.get("/",LoadSheddingController.getAllLoadShedding)

//--details load shedding protected for custoerm


router.get("/:loadsheddingId",auth(Role.CUSTOMER),LoadSheddingController.getAllLoadShedding)


//--update schdeule admin only








export const LoadSheddingRoutes = router;
