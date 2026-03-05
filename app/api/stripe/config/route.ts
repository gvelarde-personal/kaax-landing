import { NextResponse } from "next/server";
import { STRIPE_PUBLIC_KEY, isTestMode } from "@/../../lib/stripe";

// GET /api/stripe/config - Get public Stripe configuration
export async function GET() {
  return NextResponse.json({
    publicKey: STRIPE_PUBLIC_KEY,
    isTestMode: isTestMode(),
  });
}
