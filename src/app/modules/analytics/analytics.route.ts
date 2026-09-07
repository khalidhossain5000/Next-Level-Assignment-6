import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";
import { AnalyticsController } from "./analytics.controller";


const router = Router();

router.get(
    "/patient-analytics",
    auth(Role.CUSTOMER),
    AnalyticsController.getPatientAnalytics,
);

router.get(
    "/technician-analytics",
    auth(Role.TECHNICIAN),
    AnalyticsController.getDoctorAnalytics,
);

router.get(
    "/admin-analytics",
    auth(Role.ADMIN),
    AnalyticsController.getAdminAnalytics,
);

export const AnalyticsRoutes = router;