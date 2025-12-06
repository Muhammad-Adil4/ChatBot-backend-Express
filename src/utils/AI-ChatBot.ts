import OpenAI from "openai";

const generateAIResponse = async (prompt: string,) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return response.choices?.[0]?.message?.content || "No content generated";
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "Error generating content";
  }
};

export default generateAIResponse;
