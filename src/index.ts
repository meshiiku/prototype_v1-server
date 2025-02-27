import { Hono } from "hono";
import accountsApp from "./apps/userApp";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.route("/account", accountsApp);

export default app;
