import { GoogleGenAI } from "@google/genai";
import { WorkoutType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWorkoutCaption = async (
  imageBase64: string,
  workoutStats: {
    workoutType: WorkoutType;
    distanceKm?: number;
    pace?: string;
    durationSeconds: number;
  }
): Promise<string> => {
  try {
    let statsText = `- Duration: ${Math.floor(workoutStats.durationSeconds / 60)} minutes`;
    
    if (workoutStats.distanceKm) {
      statsText += `\n- Distance: ${workoutStats.distanceKm.toFixed(2)} km`;
    }
    
    if (workoutStats.pace) {
      statsText += `\n- Pace: ${workoutStats.pace} min/km`;
    }

    const prompt = `
      I just finished a ${workoutStats.workoutType.toLowerCase()} workout on my fitness app.
      Here are the stats:
      ${statsText}

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

    return response.text || "Just crushed that workout! 💪";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Feeling amazing after that session! 🔥 (AI is sleeping)";
  }
};