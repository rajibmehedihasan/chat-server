import { Router } from "express";
import { Message } from "../database";
import MessageController from "../controllers/MessageController";
import { authMiddleware } from "../middleware";

const messageRouter = Router();

//@ts-expect-error
messageRouter.post("/send", authMiddleware, MessageController.send);

messageRouter.get(
    "/get/:receiverId",
    //@ts-expect-error
    authMiddleware,
    MessageController.getConversation
);

export default messageRouter;
