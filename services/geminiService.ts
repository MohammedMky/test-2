
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function diagnoseHomeProblem(description: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional home maintenance expert. A user describes their home repair problem: "${description}". 
      
      Analyze the problem and return:
      1. What likely the problem is.
      2. The primary service category required (Plumbing, Electrical, Carpentry, Painting, Cleaning, or Gardening).
      3. Estimated urgency (Low, Medium, High).
      4. A brief safety tip if applicable.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            category: { type: Type.STRING },
            urgency: { type: Type.STRING },
            safetyTip: { type: Type.STRING }
          },
          required: ["diagnosis", "category", "urgency"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Diagnosis error:", error);
    return null;
  }
}
