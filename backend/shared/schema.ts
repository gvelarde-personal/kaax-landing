import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/nextauth";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  notes: text("notes"),
  status: text("status").notNull().default('new'), // 'new', 'contacted', 'qualified', 'lost'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true });

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type CreateLeadRequest = InsertLead;
export type UpdateLeadRequest = Partial<InsertLead>;

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  customerName: text("customer_name"),
  customerEmail: text("customer_email").notNull(),
  plan: text("plan").notNull().default("agente_pro"),
  status: text("status").notNull().default("active"), // active, cancelled, past_due
  amountMxn: integer("amount_mxn").notNull().default(18000),
  mode: text("mode").notNull().default("test"), // test | live
  createdAt: timestamp("created_at").defaultNow(),
  cancelledAt: timestamp("cancelled_at"),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true, createdAt: true });
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
