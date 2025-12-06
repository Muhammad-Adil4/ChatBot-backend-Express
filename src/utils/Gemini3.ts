import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY, // dotenv me set karo
});

export const generateGemini3Response = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });

    return response.text; // Gemini 3 ka response
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to generate AI response");
  }
};
