import { Hono } from "hono";
import { llm } from "../constants";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export const agentApp = new Hono().get("/hashtags", async (c) => {
  const info = c.req.query("message");
  if (!info) return c.json({ message: "bad request" }, 400);
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      hashtags: z
        .array(z.string())
        .describe(
          "食べ物のカテゴリハッシュタグを3つ(日本語、店名を含めない、食べ物のカテゴリ、先頭にハッシュタグ)\n例：コテコテ系,ゴリゴリ系,パサパサ系",
        ),
    }),
  );
  const prompt = PromptTemplate.fromTemplate(
    "以下の情報を提供してください：\n{format_instructions}\n{question}",
  );
  const chain = RunnableSequence.from([prompt, llm, parser]);
  const result = await chain.invoke({
    format_instructions: parser.getFormatInstructions(),
    question: info,
  });
  return c.json(result);
});
