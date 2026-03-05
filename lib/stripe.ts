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
  apiVersion: "2025-01-27.acacia",
});

export const STRIPE_PRICE_ID = isProd
  ? (process.env.STRIPE_PRICE_ID_PROD ?? "")
  : (process.env.STRIPE_PRICE_ID ?? "");

export const STRIPE_PUBLIC_KEY = isProd
  ? (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_PROD ?? "")
  : (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "");

export function isTestMode(): boolean {
  return secretKey.startsWith("sk_test_");
}
