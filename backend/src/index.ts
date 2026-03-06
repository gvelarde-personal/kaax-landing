import { Hono } from "hono";
import { logger } from "hono/logger";
import leadsRoutes from "./routes/leads";
import stripeRoutes from "./routes/stripe";

const app = new Hono();

// Middleware
app.use("*", logger());

// Manual CORS middleware - add headers to ALL responses
app.use("*", async (c, next) => {
  const origin = c.req.header("Origin");
  const allowedOrigins = [
    "http://localhost:3000",
    "https://kaax.ai",
    "https://www.kaax.ai"
  ];

  const allowOrigin = allowedOrigins.includes(origin || "") ? origin : allowedOrigins[0];

  // Set CORS headers before processing request
  c.header("Access-Control-Allow-Origin", allowOrigin);
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight
  if (c.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      }
    });
  }

  await next();
});

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
