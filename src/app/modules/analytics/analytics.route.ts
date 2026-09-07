import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";
import { AnalyticsController } from "./analytics.controller";


const router = Router();

router.get(
    "/patient-analytics",
    auth(Role.CUSTOMER),
    AnalyticsController.getCustomerAnalytics,
);

router.get(
    "/technician-analytics",
    auth(Role.TECHNICIAN),
    AnalyticsController.getTechnicianAnalytics,
);

router.get(
    "/admin-analytics",
    auth(Role.ADMIN),
    AnalyticsController.getAdminAnalytics,
);

export const AnalyticsRoutes = router;