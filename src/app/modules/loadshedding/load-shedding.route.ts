import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { loadSheddingValidation } from "./load-shedding.validation";
import { LoadSheddingService } from "./load-shedding.service";

const router = Router();

//--create load shedding schedule for admin only

router.post("/",auth(Role.ADMIN),validateRequest(loadSheddingValidation.createLoadSheddingZodSchema),LoadSheddingService.createLoadSheddingScheduleInDb)

//--get all load shedding scheudle this will be public route



//--details load shedding public



//--update schdeule admin only








export const LoadSheddingRoutes = router;
