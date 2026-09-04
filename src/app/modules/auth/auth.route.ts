import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidation } from "./auth.validation";

const router = Router();

router.post("/register",validateRequest(userValidation.registerUserValidationZodSchema),authController.registerUser)

router.post("/verify-email",authController.verifyUserEmail)

router.post("/login",validateRequest(userValidation.loginSchema),authController.loginUser)

router.post("/refresh-token", authController.refreshToken);

router.post("/google-login", authController.googleLoginUser);

router.get("/get-me",auth("CUSTOMER","CUSTOMER","TECHNICIAN"), authController.getMe);

export const AuthRoutes = router;