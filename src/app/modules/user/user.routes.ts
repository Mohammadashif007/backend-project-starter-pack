import express from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";

import { Role } from "./user.interface";

import { checkAuth } from "../../middlewares/checkAuth";

const router = express.Router();

router.post(
    "/register",
    validateRequest(createUserZodSchema),
    UserControllers.createUser
);
router.get(
    "/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserControllers.getAllUsers
);
router.patch(
    "/:id",
    checkAuth(...Object.values(Role)),
    UserControllers.updateUser
);

export const userRoutes = router;
