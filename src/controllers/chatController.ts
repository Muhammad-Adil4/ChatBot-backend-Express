import { Request, Response } from "express";
import {
  createChat,
  getChatsForUser,
  getChatById,
  sendMessage,
  ChatWithUsersAndMessages,
} from "../services/chatService";
import { Message } from "../generated/prisma/client";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// ---------------------------- CREATE CHAT ----------------------------
export const createChatController = async (
  req: Request,
  res: Response<ApiResponse<ChatWithUsersAndMessages>>
): Promise<void> => {
  try {
    const { userIds, title } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length < 1) {
      res.status(400).json({
        success: false,
        message: "At least one userId is required to create a chat",
      });
      return;
    }

    const chat = await createChat(userIds, title);

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      data: chat,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    res.status(400).json({ success: false, message });
  }
};

// ---------------------------- GET CHATS FOR USER ----------------------------
export const getChatsForUserController = async (
  req: Request,
  res: Response<ApiResponse<ChatWithUsersAndMessages[]>>
): Promise<void> => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ success: false, message: "userId is required" });
      return;
    }

    const chats = await getChatsForUser(userId);

    res.status(200).json({
      success: true,
      message: "Chats retrieved successfully",
      data: chats,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    res.status(400).json({ success: false, message });
  }
};

// ---------------------------- GET CHAT BY ID ----------------------------
export const getChatByIdController = async (
  req: Request,
  res: Response<ApiResponse<ChatWithUsersAndMessages | null>>
): Promise<void> => {
  try {
    const chatId = req.params.chatId;
    if (!chatId) {
      res.status(400).json({ success: false, message: "chatId is required" });
      return;
    }

    const chat = await getChatById(chatId);
    if (!chat) {
      res.status(404).json({ success: false, message: "Chat not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Chat retrieved successfully",
      data: chat,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    res.status(400).json({ success: false, message });
  }
};

// ---------------------------- SEND MESSAGE ----------------------------
export const sendMessageController = async (
  req: Request,
  res: Response<ApiResponse<Message>>
): Promise<void> => {
  try {
    const { chatId, senderId, content } = req.body;

    if (!chatId || !senderId || !content || content.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "chatId, senderId, and non-empty content are required",
      });
      return;
    }

    const chat = await getChatById(chatId);
    if (!chat) {
      res.status(404).json({ success: false, message: "Chat not found" });
      return;
    }

    const message = await sendMessage(chatId, senderId, content);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    res.status(400).json({ success: false, message });
  }
};
