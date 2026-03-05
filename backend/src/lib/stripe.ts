import Stripe from "stripe";

export const isProd = process.env.NODE_ENV === "production";

const secretKey = isProd
  ? process.env.STRIPE_SECRET_KEY_PROD
  : process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error(
    isProd
      ? "STRIPE_SECRET_KEY_PROD is required in production"
      : "STRIPE_SECRET_KEY is required in development"
  );
}

export const stripe = new Stripe(secretKey, {
  apiVersion: "2026-02-25.clover",
});

export const STRIPE_PRICE_ID = isProd
  ? (process.env.STRIPE_PRICE_ID_PROD ?? "")
  : (process.env.STRIPE_PRICE_ID ?? "");

export function isTestMode(): boolean {
  if (!secretKey) return true;
  return secretKey.startsWith("sk_test_");
}
