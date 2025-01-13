import { Router } from "express";
import AuthController from "../controllers/AuthController";

const userRouter = Router();

// @ts-expect-error
userRouter.post("/register", AuthController.register);
// @ts-expect-error
userRouter.post("/login", AuthController.login);

export default userRouter;
