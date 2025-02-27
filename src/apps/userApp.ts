import { Hono } from "hono";
import { jwt, sign } from "hono/jwt";
import { prismaClient } from "../constants";

// WARNING: 開発用にハードコーディング
const JWT_SECRET = "HOGEHOGE";

type JWTPayload = {
  display_name: string;
  id: string;
  user_id: string;
  exp: number;
};
export async function generateJWTToken(
  payload: JWTPayload,
  jwt_secret: string,
) {
  return await sign(payload, jwt_secret);
}
function generateRandomUserName() {
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
  return `${dummy_users[Math.floor(Math.random() * dummy_users.length)]}${Math.floor(Math.random() * 100000000)}`;
}

const accountsApp = new Hono();
accountsApp
  // jwt認証をかける
  .use(
    "/auth/*",
    jwt({
      secret: JWT_SECRET,
    }),
  )
  .get("/auth/check", (c) => {
    return c.text("Ok! you are logged in!");
  })
  .get("/users/:user_id", async (c) => {
    const user = await prismaClient.user.findFirst({
      where: {
        user_id: c.req.param("user_id"),
      },
    });
    if (user)
      return c.json({
        display_name: user.display_name,
        id: user.user_id,
      });
    else return c.json({});
  })
  .get("/anonymous", async (c) => {
    // 適当にユーザー名を生成する
    const userName = generateRandomUserName();

    // dbに登録
    try {
      const user = await prismaClient.user.create({
        data: {
          display_name: `${userName}`,
          password: `aiueo`,
          user_id: `${userName}`,
        },
      });

      // payloadとシークレットを渡してjwt発行
      const jwt = await generateJWTToken(
        {
          display_name: user.display_name,
          id: user.id,
          user_id: user.user_id,
          exp: Math.floor(Date.now() / 1000) + 60 * 1, // 1min
        },
        JWT_SECRET,
      );

      // jwtを返す
      return c.text(jwt);
    } catch {
      c.text("Error occured", 500);
    }
  })
  .get("/auth/info", async (c) => {});

export default accountsApp;
