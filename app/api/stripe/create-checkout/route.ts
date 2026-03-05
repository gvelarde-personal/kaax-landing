import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PRICE_ID } from "@/../../lib/stripe";

// POST /api/stripe/create-checkout - Create a Stripe Checkout Session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, customerName } = body;

    if (!customerEmail) {
      return NextResponse.json(
        { message: "Email requerido" },
        { status: 400 }
      );
    }

    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const baseUrl = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      customer_email: customerEmail,
      metadata: { customerName: customerName || "" },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#precios`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { message: error.message || "Error al crear sesión de pago" },
      { status: 500 }
    );
  }
}
