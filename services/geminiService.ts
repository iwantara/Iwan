import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Note: We expect process.env.API_KEY to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getInterestFunFact = async (interest: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found. Skipping AI generation.");
    return "";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Berikan satu fakta menarik, lucu, atau tips singkat yang sangat berguna untuk seseorang yang tertarik dengan: "${interest}".
      Jawab dalam Bahasa Indonesia yang santai dan gaul. Maksimal 2 kalimat.`,
    });
    
    return response.text || "Tidak dapat memuat fakta saat ini.";
  } catch (error) {
    console.error("Error fetching fun fact:", error);
    return "";
  }
};