import Stripe from "stripe";

if (!process.env.STRIPE_SECRET) {
  throw new Error("STRIPE_SECRET environment variable is required");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2025-01-27.acacia",
});

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || "price_1T5D4uGbRXr7M08ql13wt45B";
export const STRIPE_PUBLIC_KEY = process.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_51Ri1T7GbRXr7M08q2KuPWGsy1zmOjKVEWDGHCYn8rBYSpM8xTJ7zu56WrW4dNYWw1iP3IFHNfUKqyQR29epc5mi400Y33N60AL";

export function isTestMode(): boolean {
  return (process.env.STRIPE_SECRET || "").startsWith("sk_test_");
}
