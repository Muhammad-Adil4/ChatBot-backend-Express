import { Router } from "express";
import {
  createChatController,
  getChatsForUserController,
  getChatByIdController,
  sendMessageController,
} from "../controllers/chatController";

const chatRouter = Router();

// ------------------- CREATE CHAT -------------------
chatRouter.post("/create", createChatController);

// ------------------- GET CHATS FOR USER -------------------
chatRouter.get("/user/:userId", getChatsForUserController);

// ------------------- GET CHAT BY ID -------------------
chatRouter.get("/:chatId", getChatByIdController);

// ------------------- SEND MESSAGE -------------------
chatRouter.post("/message", sendMessageController);

export default chatRouter;
