
import { GoogleGenAI, Chat, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data) {
      return part.inlineData.data;
    } else {
      console.error('Image generation response did not contain image data:', JSON.stringify(response, null, 2));
      throw new Error("Image generation failed to return any images.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const startChat = (): Chat => {
    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a fun and friendly chatbot for kids and parents. You help with creative ideas and answer questions in a simple, encouraging way.',
      },
    });
};