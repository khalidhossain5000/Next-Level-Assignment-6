import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register",authController.registerUser)
router.post("/verify-email",authController.verifyUserEmail)
router.post("/login",authController.loginUser)
router.post("/refresh-token", authController.refreshToken);
router.post("/google-login", authController.googleLoginUser);
router.get("/get-me", authController.getMe);

export const AuthRoutes = router;