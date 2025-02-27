import { Hono } from "hono";
import { sign } from "hono/jwt";

// WARNING: 開発用にハードコーディング
const JWT_SECRET = "HOGEHOGE";
const dummy_users = [
  "taro",
  "goro",
  "jiro",
  "takeru",
  "masuo",
  "haneda",
  "hayate",
  "genki",
  "jelly",
  "neko",
  "inu",
];

type JWTPayload = {
  display_name: string;
  uid: number;
  exp: number;
};
export async function generateJWTToken(
  payload: JWTPayload,
  jwt_secret: string,
) {
  return await sign(payload, jwt_secret);
}
const accountsApp = new Hono();
accountsApp.get("/dummy", async (c) => {
  const jwt = await generateJWTToken(
    {
      display_name: `${dummy_users[Math.floor(Math.random() * dummy_users.length)]}${Math.floor(Math.random() * 1000)}`,
      uid: 2,
      exp: Math.floor(Date.now() / 1000) + 60 * 100, // 100min
    },
    JWT_SECRET,
  );

  return c.text(jwt);
});

export default accountsApp;
