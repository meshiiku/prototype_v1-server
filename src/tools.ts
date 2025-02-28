import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const hotpepperTool = new DynamicStructuredTool({
  name: "nearGourmet",
  description:
    "緯度と経度から近くのお店を検索することができます。(id:お店ID,name:お店の名前,genre:お店の種類(ジャンル))",
  schema: z.object({
    lat: z.number().describe("緯度"),
    lng: z.number().describe("経度"),
  }),
  func: async ({ lat, lng }: { lat: number; lng: number }) => {
    console.log("Executing tools");
    const res = await fetch(
      `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${process.env.HOTPEPPER_API_KEY}&lat=${lat}&lng=${lng}&range=5&format=json&count=30`,
    );
    return res.json();
  },
});
