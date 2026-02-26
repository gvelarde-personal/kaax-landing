import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { stripe, STRIPE_PRICE_ID, STRIPE_PUBLIC_KEY, isTestMode } from "./stripe";
import express from "express";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  // ── Stripe: expose public config to frontend ──────────────────────────────
  app.get("/api/stripe/config", (_req, res) => {
    res.json({ publicKey: STRIPE_PUBLIC_KEY, isTestMode: isTestMode() });
  });

  // ── Stripe: create checkout session ──────────────────────────────────────
  app.post("/api/stripe/create-checkout", async (req, res) => {
    try {
      const { customerEmail, customerName } = req.body;
      if (!customerEmail) {
        return res.status(400).json({ message: "Email requerido" });
      }

      const protocol = req.headers["x-forwarded-proto"] || req.protocol;
      const host = req.headers["x-forwarded-host"] || req.headers.host;
      const baseUrl = `${protocol}://${host}`;

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
        customer_email: customerEmail,
        metadata: { customerName: customerName || "" },
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/#precios`,
        allow_promotion_codes: true,
        billing_address_collection: "required",
      });

      res.json({ url: session.url, sessionId: session.id });
    } catch (err: any) {
      console.error("Stripe checkout error:", err);
      res.status(500).json({ message: err.message || "Error al crear sesión de pago" });
    }
  });

  // ── Stripe: webhook (requires raw body) ──────────────────────────────────
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event: any;
      try {
        if (webhookSecret) {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
          event = JSON.parse(req.body.toString());
          console.warn("⚠️  STRIPE_WEBHOOK_SECRET not set — skipping signature validation");
        }
      } catch (err: any) {
        console.error("Webhook signature error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      const mode = isTestMode() ? "test" : "live";

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const existing = await storage.getSubscriptionBySessionId(session.id);
          if (!existing) {
            await storage.createSubscription({
              stripeSessionId: session.id,
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
              customerEmail: session.customer_email,
              customerName: session.metadata?.customerName || null,
              plan: "agente_pro",
              status: "active",
              amountMxn: 18000,
              mode,
            });
          }
          break;
        }
        case "customer.subscription.updated": {
          const sub = event.data.object;
          const sessions = await stripe.checkout.sessions.list({ subscription: sub.id, limit: 1 });
          if (sessions.data.length > 0) {
            await storage.updateSubscriptionStatus(sessions.data[0].id, sub.status, {
              stripeSubscriptionId: sub.id,
            });
          }
          break;
        }
        case "customer.subscription.deleted": {
          const sub = event.data.object;
          const sessions = await stripe.checkout.sessions.list({ subscription: sub.id, limit: 1 });
          if (sessions.data.length > 0) {
            await storage.updateSubscriptionStatus(sessions.data[0].id, "cancelled", {
              cancelledAt: new Date(),
            });
          }
          break;
        }
        default:
          console.log(`Unhandled Stripe event: ${event.type}`);
      }

      res.json({ received: true });
    }
  );

  // ── Stripe: get subscriptions (admin) ─────────────────────────────────────
  app.get("/api/subscriptions", async (req, res) => {
    try {
      const isDev = process.env.NODE_ENV === "development";
      const replitUser = req.headers["x-replit-user-id"];
      if (!replitUser && !isDev) {
        return res.status(401).json({ message: "No autorizado" });
      }
      const subs = await storage.getSubscriptions();
      res.json(subs);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get(api.leads.list.path, async (req, res) => {
    try {
      const isDev = process.env.NODE_ENV === "development";
      const replitUser = req.headers["x-replit-user-id"];
      
      // In development, if not logged in, we can still show leads for testing
      // but in production, we strictly require auth
      if (!replitUser && !isDev) {
        return res.status(401).json({ message: "No autorizado" });
      }
      
      const allLeads = await storage.getLeads();
      res.status(200).json(allLeads);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.leads.get.path, async (req, res) => {
    try {
      const isDev = process.env.NODE_ENV === "development";
      const replitUser = req.headers["x-replit-user-id"];
      if (!replitUser && !isDev) {
        return res.status(401).json({ message: "No autorizado" });
      }
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const lead = await storage.getLead(id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.status(200).json(lead);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.leads.create.path, async (req, res) => {
    try {
      const input = api.leads.create.input.parse(req.body);
      const lead = await storage.createLead(input);
      res.status(201).json(lead);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.leads.update.path, async (req, res) => {
    try {
      const isDev = process.env.NODE_ENV === "development";
      const replitUser = req.headers["x-replit-user-id"];
      if (!replitUser && !isDev) {
        return res.status(401).json({ message: "No autorizado" });
      }
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const input = api.leads.update.input.parse(req.body);
      
      const lead = await storage.getLead(id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      const updatedLead = await storage.updateLead(id, input);
      res.status(200).json(updatedLead);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.leads.delete.path, async (req, res) => {
    try {
      const isDev = process.env.NODE_ENV === "development";
      const replitUser = req.headers["x-replit-user-id"];
      if (!replitUser && !isDev) {
        return res.status(401).json({ message: "No autorizado" });
      }
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const lead = await storage.getLead(id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      await storage.deleteLead(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed data
  try {
    const existingLeads = await storage.getLeads();
    if (existingLeads.length === 0) {
      await storage.createLead({
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1 555-0101",
        company: "Tech Corp",
        status: "new",
        notes: "Interested in agent automation",
      });
      await storage.createLead({
        name: "Bob Smith",
        email: "bob@example.com",
        phone: "+1 555-0102",
        company: "Sales Co",
        status: "qualified",
        notes: "Looking for a fast way to identify leads",
      });
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }

  return httpServer;
}
