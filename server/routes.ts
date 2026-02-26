import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);
  
  app.get(api.leads.list.path, async (req, res) => {
    try {
      const replitUser = req.headers["x-replit-user-id"];
      if (!replitUser) {
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
      const replitUser = req.headers["x-replit-user-id"];
      if (!replitUser) {
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
      const replitUser = req.headers["x-replit-user-id"];
      if (!replitUser) {
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
      const replitUser = req.headers["x-replit-user-id"];
      if (!replitUser) {
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
