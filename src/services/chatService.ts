import { prisma } from "../config/database";
import { Chat, Message, User } from "../generated/prisma/client";
import { generateGemini3Response } from "../utils/Gemini3"; // tumhara AI service

export interface ChatWithUsersAndMessages extends Chat {
  users: User[];
  messages: Message[];
}

// ---------------------- CREATE CHAT ----------------------
export const createChat = async (
  userIds: string[],
  title?: string
): Promise<ChatWithUsersAndMessages> => {
  // Prevent duplicate 1-1 chat
  if (userIds.length === 2) {
    const existingChat = await prisma.chat.findFirst({
      where: {
        users: {
          every: {
            id: { in: userIds },
          },
        },
      },
      include: { users: true, messages: { orderBy: { createdAt: "asc" } } },
    });

    if (existingChat) return existingChat;
  }

  const chat = await prisma.chat.create({
    data: {
      title,
      users: { connect: userIds.map((id) => ({ id })) },
    },
    include: { users: true, messages: { orderBy: { createdAt: "asc" } } },
  });

  return chat;
};

// ---------------------- GET CHATS FOR USER ----------------------
export const getChatsForUser = async (
  userId: string
): Promise<ChatWithUsersAndMessages[]> => {
  return await prisma.chat.findMany({
    where: { users: { some: { id: userId } } },
    include: { users: true, messages: { orderBy: { createdAt: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
};

// ---------------------- GET CHAT BY ID ----------------------
export const getChatById = async (
  chatId: string
): Promise<ChatWithUsersAndMessages | null> => {
  return await prisma.chat.findUnique({
    where: { id: chatId },
    include: { users: true, messages: { orderBy: { createdAt: "asc" } } },
  });
};

// ---------------------- SEND MESSAGE ----------------------
export const sendMessage = async (
  chatId: string,
  senderId: string,
  content: string
): Promise<Message> => {
  // Create user's message
  const userMessage = await prisma.message.create({
    data: {
      chatId,
      senderId,
      content,
      role: "USER",
    },
    include: { sender: true },
  });

  // Update chat timestamp
  await prisma.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });

  if (senderId !== "AI_SYSTEM_USER") {

 const aiContent = await generateGemini3Response(content);

if (aiContent && aiContent.trim().length > 0) {
  await prisma.message.create({
    data: {
      chatId,
      senderId: "AI_SYSTEM_USER",
      content: aiContent, 
      role: "AI",
    },
    include: { sender: true },
  });
}
    // Update chat again for AI message
    await prisma.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });
  }

  return userMessage;
};
