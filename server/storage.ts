import { db } from "./db";
import {
  leads, subscriptions,
  type CreateLeadRequest,
  type UpdateLeadRequest,
  type Lead,
  type Subscription,
  type InsertSubscription,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: CreateLeadRequest): Promise<Lead>;
  updateLead(id: number, updates: UpdateLeadRequest): Promise<Lead>;
  deleteLead(id: number): Promise<void>;

  getSubscriptions(): Promise<Subscription[]>;
  getSubscriptionBySessionId(sessionId: string): Promise<Subscription | undefined>;
  createSubscription(sub: InsertSubscription): Promise<Subscription>;
  updateSubscriptionStatus(sessionId: string, status: string, extra?: Partial<InsertSubscription>): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async createLead(lead: CreateLeadRequest): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async updateLead(id: number, updates: UpdateLeadRequest): Promise<Lead> {
    const [updated] = await db.update(leads)
      .set(updates)
      .where(eq(leads.id, id))
      .returning();
    return updated;
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  async getSubscriptions(): Promise<Subscription[]> {
    return await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
  }

  async getSubscriptionBySessionId(sessionId: string): Promise<Subscription | undefined> {
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.stripeSessionId, sessionId));
    return sub;
  }

  async createSubscription(sub: InsertSubscription): Promise<Subscription> {
    const [newSub] = await db.insert(subscriptions).values(sub).returning();
    return newSub;
  }

  async updateSubscriptionStatus(sessionId: string, status: string, extra?: Partial<InsertSubscription>): Promise<void> {
    await db.update(subscriptions)
      .set({ status, ...extra })
      .where(eq(subscriptions.stripeSessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
