import { Request, Response } from "express";
import { generateGemini3Response } from "../utils/Gemini3";

export const generateAI = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }
    const aiResponse = await generateGemini3Response(prompt);

    res.status(200).json({
      success: true,
      message: "AI response generated successfully",
      data: aiResponse,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate AI response",
    });
  }
};
