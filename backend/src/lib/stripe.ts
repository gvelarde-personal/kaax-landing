import Stripe from "stripe";

export const isProd = () => process.env.NODE_ENV === "production";

let _stripe: Stripe | null = null;
let _secretKey: string | null = null;

function initializeStripe() {
  const prod = isProd();
  _secretKey = prod
    ? process.env.STRIPE_SECRET_KEY_PROD
    : process.env.STRIPE_SECRET_KEY;

  if (!_secretKey) {
    throw new Error(
      prod
        ? "STRIPE_SECRET_KEY_PROD is required in production"
        : "STRIPE_SECRET_KEY is required in development"
    );
  }

  _stripe = new Stripe(_secretKey, {
    apiVersion: "2026-02-25.clover",
  });
}

export const getStripe = () => {
  if (!_stripe) initializeStripe();
  return _stripe!;
};

// Export for backwards compatibility
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    return (getStripe() as any)[prop];
  },
});

export const STRIPE_PRICE_ID = () => {
  const prod = isProd();
  return prod
    ? (process.env.STRIPE_PRICE_ID_PROD ?? "")
    : (process.env.STRIPE_PRICE_ID ?? "");
};

export function isTestMode(): boolean {
  if (!_secretKey && !_stripe) initializeStripe();
  if (!_secretKey) return true;
  return _secretKey.startsWith("sk_test_");
}
