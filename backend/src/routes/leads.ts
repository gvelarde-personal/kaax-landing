import { Hono } from "hono";
import { storage } from "../lib/storage";
import { z } from "zod";
import { insertLeadSchema } from "../../shared/schema";

const app = new Hono();

// GET /leads - List all leads
app.get("/", async (c) => {
  try {
    // In development, bypass auth for easier testing
    // TODO: Add proper auth middleware
    if (process.env.NODE_ENV !== "development") {
      // await requireAdmin(c);
    }

    const leads = await storage.getLeads();
    return c.json(leads);
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return c.json({ message: "No autorizado" }, 401);
    }
    console.error("Error fetching leads:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

// POST /leads - Create a new lead
app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const input = insertLeadSchema.parse(body);

    const lead = await storage.createLead(input);
    return c.json(lead, 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return c.json(
        {
          message: error.errors[0].message,
          field: error.errors[0].path.join("."),
        },
        400
      );
    }
    console.error("Error creating lead:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

export default app;
