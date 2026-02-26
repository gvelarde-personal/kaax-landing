import Stripe from "stripe";

// In production (published app), NODE_ENV=production is set by the deploy run command.
// In development, NODE_ENV=development is set by npm run dev.
export const isProd = process.env.NODE_ENV === "production";

const secretKey = isProd
  ? process.env.STRIPE_SECRET_PROD
  : process.env.STRIPE_SECRET;

if (!secretKey) {
  throw new Error(
    isProd
      ? "STRIPE_SECRET_PROD is required in production"
      : "STRIPE_SECRET is required in development"
  );
}

export const stripe = new Stripe(secretKey, {
  apiVersion: "2025-01-27.acacia",
});

// Price ID — used for creating Stripe Checkout sessions
export const STRIPE_PRICE_ID = isProd
  ? (process.env.STRIPE_PRICEID_PROD ?? "")
  : (process.env.STRIPE_PRICE_ID ?? "price_1T5D4uGbRXr7M08ql13wt45B");

// Product ID — stored for reference/future use (not needed for checkout)
export const STRIPE_PRODUCT_ID = isProd
  ? (process.env.STRIPE_PRODUCTID_PROD ?? "")
  : (process.env.STRIPE_PRODUCT_ID ?? "prod_U3JifPzHCM8D28");

// Public key — returned to the frontend via /api/stripe/config
export const STRIPE_PUBLIC_KEY = isProd
  ? (process.env.STRIPE_PUBLIC_PROD ?? "")
  : (process.env.VITE_STRIPE_PUBLIC_KEY ?? "pk_test_51Ri1T7GbRXr7M08q2KuPWGsy1zmOjKVEWDGHCYn8rBYSpM8xTJ7zu56WrW4dNYWw1iP3IFHNfUKqyQR29epc5mi400Y33N60AL");

export function isTestMode(): boolean {
  return secretKey.startsWith("sk_test_");
}
