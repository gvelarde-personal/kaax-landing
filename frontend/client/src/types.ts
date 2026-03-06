import { z } from "zod";

// Lead types
export type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
  status: string;
  createdAt: Date | null;
};

// Input validation schemas
export const insertLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
});

export type LeadInput = z.infer<typeof insertLeadSchema>;

export const updateLeadSchema = z.object({
  status: z.string().optional(),
  notes: z.string().optional(),
});

export type LeadUpdateInput = z.infer<typeof updateLeadSchema>;

// Subscription types
export type Subscription = {
  id: number;
  stripeSessionId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  customerName: string | null;
  customerEmail: string;
  plan: string;
  status: string;
  amountMxn: number;
  mode: string;
  createdAt: Date | null;
  cancelledAt: Date | null;
};
