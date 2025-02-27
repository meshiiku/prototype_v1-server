import { Hono } from "hono";
import accountsApp from "./apps/userApp";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.use("/static/*", serveStatic({ root: "./" }));
app.route("/account", accountsApp);

export default app;
