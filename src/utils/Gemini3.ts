// utils/Gemini3.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Keep track of last request time
let lastRequestTime = 0;
const RATE_LIMIT_INTERVAL = 10 * 1000; // 10 seconds in ms

export const generateGemini3Response = async (prompt: string) => {
  const now = Date.now();
  const elapsed = now - lastRequestTime;

  // If last request was less than 10s ago, wait
  if (elapsed < RATE_LIMIT_INTERVAL) {
    const waitTime = RATE_LIMIT_INTERVAL - elapsed;
    console.log(`Throttling AI request, waiting ${waitTime} ms`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });

    lastRequestTime = Date.now(); // update last request timestamp

    return response.text;
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to generate AI response");
  }
};
