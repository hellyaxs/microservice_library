
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getAIInsights = async (prompt: string) => {
  if (!API_KEY) return "AI services are unavailable (Missing API Key).";
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the AI assistant for the Digital Library Microservices Management platform. You have access to catalog data and can provide recommendations, summaries of business performance, and technical troubleshooting tips for the microservices architecture (NestJS, Go, Spring, FastAPI). Be professional and helpful."
      }
    });
    return response.text || "I couldn't generate an answer at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with the AI brain.";
  }
};
