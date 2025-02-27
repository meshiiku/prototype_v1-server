import { PrismaClient } from "@prisma/client";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

export const prismaClient = new PrismaClient();
export const llm = new ChatGoogleGenerativeAI({
  modelName: "gemini-2.0-flash-lite",
  maxOutputTokens: 2048,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});
