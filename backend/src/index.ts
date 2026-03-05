import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import leadsRoutes from "./routes/leads";
import stripeRoutes from "./routes/stripe";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL]
      : ["http://localhost:3000", "https://kaax.ai", "https://*.kaax.ai"],
    credentials: true,
  })
);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.route("/leads", leadsRoutes);
app.route("/stripe", stripeRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404);
});

export default app;
