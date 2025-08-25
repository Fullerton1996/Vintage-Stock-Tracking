
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Description generation will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateDescription = async (keywords: string): Promise<string> => {
  if (!API_KEY) {
    return "API key not configured. Please add your Gemini API key.";
  }
  
  if (!keywords.trim()) {
    return "";
  }

  try {
    const prompt = `Generate a short, elegant, and enticing product description for a piece of vintage lingerie. The description should be romantic and alluring. Use these keywords as inspiration: "${keywords}". Keep the description to a maximum of 3 sentences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return "There was an error generating the description. Please try again.";
  }
};
