import { Hono } from "hono";
import accountsApp from "./apps/userApp";
import { serveStatic } from "hono/bun";
import agentApp from "./apps/agentApp";
import { cors } from 'hono/cors'

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.use("/static/*", serveStatic({ root: "./" }));
app.route("/account", accountsApp);
app.route("/agent", agentApp);

export default app;
