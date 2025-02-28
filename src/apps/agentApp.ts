import { Hono } from "hono";
import { llm, suggestAgent, llmWithTools } from "../constants";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { Record } from "@prisma/client/runtime/library";
import { BufferMemory } from "langchain/memory";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
const chatHistories: Record<string, BufferMemory> = {};

chatHistories["0"] = new BufferMemory({
  returnMessages: true,
  memoryKey: "history",
});
const chatHistory = chatHistories["0"];
chatHistory.chatHistory.addMessage(
  new SystemMessage(
    "あなたは今日の外食を提案する日本語AIエージェントです。まず初めに近くのお店を検索して、そこからユーザに質問を投げかけて形式でお店を絞るようにお願いします。最終的に決まったらお店IDを出力してください。ツールは一回まで使っていいです。43.12936561225927, 141.34405448760404",
  ),
);
const chatApp = new Hono()
  .get("/create", (c) => {
    // 新たにメモリを作成して、セッションIDを返します。
    const session_id = crypto.randomUUID();

    chatHistories[session_id] = new BufferMemory({
      returnMessages: true,
      memoryKey: "history",
    });
    const chatHistory = chatHistories[session_id];
    chatHistory.chatHistory.addMessage(
      new SystemMessage(
        "あなたは今日の外食を提案する日本語AIエージェントです。まず初めに近くのお店を検索して、そこからユーザに質問を投げかけて形式でお店を絞るようにお願いします。",
      ),
    );
    return c.json({ session_id: session_id });
  })
  .get("/:session_id/chat", async (c) => {
    const userMessage = c.req.query("message");
    const session_id = c.req.param("session_id");

    if (!chatHistories[session_id])
      return c.json(
        {
          message: "session not found",
        },
        404,
      );
    if (!userMessage)
      return c.json(
        {
          message: "badrequest",
        },
        400,
      );
    const history = chatHistories[session_id];
    // ユーザーの入力を追加
    history.chatHistory.addMessage(new HumanMessage(userMessage));
    const response = await suggestAgent.invoke({
      messages: await history.chatHistory.getMessages(),
    });
    console.log(response);

    return c.text(response.messages[response.messages.length - 1].content);
  });

const agentApp = new Hono()
  .route("/chat/", chatApp)
  .use("/*", async (c, next) => {
    if (c.req.query("message")) await next();
    return c.json(
      { message: "bad request", description: "message query is require" },
      400,
    );
  })
  .get("/hashtags", async (c) => {
    const info = c.req.query("message");
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
export default agentApp;
