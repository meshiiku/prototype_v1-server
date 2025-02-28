import { PrismaClient } from "@prisma/client";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { hotpepperTool } from "./tools";
import {
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";

import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";

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

export const llmWithTools = new ChatGoogleGenerativeAI({
  modelName: "gemini-2.0-flash-lite",
  maxOutputTokens: 2048,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
}).bindTools([hotpepperTool]);

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await llmWithTools.invoke(state.messages);
  return { messages: [response] };
}

function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1] as AIMessage;

  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    console.log("⭐ Using " + lastMessage.tool_calls[0].name);
    return "tool";
  }

  return END;
}
export const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tool", new ToolNode([hotpepperTool]))
  .addEdge(START, "agent")
  .addEdge("tool", "agent")
  .addConditionalEdges("agent", shouldContinue);
export const suggestAgent = workflow.compile();
