import { Request, Response } from "express";
import generateAIResponse from "../utils/AI-ChatBot";

export const getAIResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }
    const text = await generateAIResponse(prompt);
    res.status(200).json({ success: true, text });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
