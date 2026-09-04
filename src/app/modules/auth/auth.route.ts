import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidation } from "./auth.validation";
import { Role } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";

const router = Router();

router.post("/register",validateRequest(userValidation.registerUserValidationZodSchema),authController.registerUser)

router.post("/verify-email",authController.verifyUserEmail)

router.post("/login",validateRequest(userValidation.loginSchema),authController.loginUser)

router.post("/refresh-token", authController.refreshToken);

router.post("/google-login", authController.googleLoginUser);


//update user profile info

router.patch("/update-profile",auth(Role.ADMIN,Role.CUSTOMER,Role.TECHNICIAN),upload.single("profileImage"),authController.updateUserProfile)

router.get("/get-me",auth(Role.ADMIN,Role.TECHNICIAN,Role.CUSTOMER), authController.getMe);

export const AuthRoutes = router;