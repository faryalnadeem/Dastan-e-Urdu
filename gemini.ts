
import { GoogleGenAI } from "@google/genai";
import { Novel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getNovelSummary = async (novel: Novel): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a detailed summary and literary analysis of the Urdu novel "${novel.title}" by ${novel.author}. The summary should be informative for someone who wants to understand the key themes and plot without spoilers. Please write the response in Urdu (Nastaliq style preferred in content).`,
    });
    return response.text || "Summary unavailable at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI service is currently busy. Please try again later.";
  }
};

export const chatWithAssistant = async (novel: Novel, message: string, history: { role: string, content: string }[]): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are an expert in Urdu literature. You are helping a reader understand the novel "${novel.title}" by ${novel.author}. Answer their questions about themes, characters, and cultural context. If they ask about plot points, answer them accurately. Respond primarily in Urdu unless the user asks in English. Maintain a helpful and scholarly tone.`,
      },
    });

    // Note: sendMessage doesn't support full history in this simplified API call here, 
    // but the system instruction keeps context.
    const response = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error communicating with AI assistant.";
  }
};
