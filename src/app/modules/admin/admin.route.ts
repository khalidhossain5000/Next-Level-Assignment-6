import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { AdminController } from "./admin.controller";

const router = Router();

//-- get all users with search filter to manage theme
router.get("/users",auth(Role.ADMIN),AdminController.getAllUsers)

// -- update users status like ban unban

router.patch("/users",auth(Role.ADMIN))

// -- get all technician to manage and assign them to outage

router.get("/users",auth(Role.ADMIN))

// -- assign technican to outage post i guess

router.post("/users",auth(Role.ADMIN))

// -- analytics overall report data

router.get("/users",auth(Role.ADMIN))


// -- get all payment record with search filter pagination

router.get("/users",auth(Role.ADMIN))










export const AdminRoutes = router;
