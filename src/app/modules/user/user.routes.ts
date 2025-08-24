import express from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";

const router = express.Router();

router.post(
    "/register",
    validateRequest(createUserZodSchema),
    UserControllers.createUser
);
router.get("/", UserControllers.getAllUsers);

export const userRoutes = router;
