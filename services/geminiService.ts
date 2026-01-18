import { GoogleGenAI } from "@google/genai";
import { RunSession } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRunCaption = async (
  imageBase64: string,
  runStats: Pick<RunSession, 'distanceKm' | 'pace' | 'durationSeconds'>
): Promise<string> => {
  try {
    const prompt = `
      I just finished a run recorded on my fitness app.
      Here are the stats:
      - Distance: ${runStats.distanceKm.toFixed(2)} km
      - Pace: ${runStats.pace} min/km
      - Duration: ${Math.floor(runStats.durationSeconds / 60)} minutes

      Look at the selfie I just took.
      Generate a short, fun, Gen-Z style social media caption (max 20 words) that mentions my effort or the vibe of the photo. 
      Use emojis. Be supportive but casual. 
      Do NOT include hashtags.
    `;

    // Remove data URL prefix if present for Gemini API
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', 
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    return response.text || "Just finished a run! 🏃‍♂️💨";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Crushed it! 💪 (AI is sleeping)";
  }
};
