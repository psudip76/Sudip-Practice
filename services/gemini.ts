
import { GoogleGenAI, Type } from "@google/genai";
import { BrickData, BrickType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateLegoCreation = async (prompt: string): Promise<Omit<BrickData, 'id'>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Design a simple Lego-like model for: "${prompt}". 
      Return a list of bricks with coordinates. 
      The baseplate is at y=0. X and Z can range from -10 to 10.
      Use standard types: '1x1', '1x2', '2x2', '2x4', '1x4', '2x8'.
      Use hex colors.
      Ensure bricks are connected and logical.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "Brick size (e.g. '2x4')" },
              position: { 
                type: Type.ARRAY, 
                items: { type: Type.NUMBER }, 
                description: "[x, y, z] coordinates" 
              },
              color: { type: Type.STRING, description: "Hex color code" },
              rotation: { type: Type.NUMBER, description: "Y rotation in radians (0 or 1.57)" }
            },
            required: ["type", "position", "color", "rotation"]
          }
        }
      }
    });

    const data = JSON.parse(response.text);
    return data as Omit<BrickData, 'id'>[];
  } catch (error) {
    console.error("Gemini generation failed:", error);
    throw error;
  }
};
