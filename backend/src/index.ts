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
    origin: (origin) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://kaax.ai",
        "https://www.kaax.ai",
      ];

      // Allow all Cloudflare Pages domains
      if (origin && (origin.endsWith(".pages.dev") || allowedOrigins.includes(origin))) {
        return origin;
      }

      return allowedOrigins[0];
    },
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
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
