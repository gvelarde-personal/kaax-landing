import { NextRequest, NextResponse } from "next/server";
import { stripe, isProd, isTestMode } from "@/../../lib/stripe";
import { storage } from "@/../../lib/storage";

export const runtime = "nodejs";

// POST /api/stripe/webhook - Handle Stripe webhooks
export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { message: "No signature provided" },
      { status: 400 }
    );
  }

  const webhookSecret = isProd
    ? process.env.STRIPE_WEBHOOK_SECRET_PROD
    : process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body);
      console.warn(
        "⚠️  STRIPE_WEBHOOK_SECRET not set — skipping signature validation"
      );
    }
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json(
      { message: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  const mode = isTestMode() ? "test" : "live";

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const existing = await storage.getSubscriptionBySessionId(session.id);

        if (!existing) {
          await storage.createSubscription({
            stripeSessionId: session.id,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            customerEmail: session.customer_email,
            customerName: session.metadata?.customerName || null,
            plan: "agente_pro",
            status: "active",
            amountMxn: 18000,
            mode,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const sessions = await stripe.checkout.sessions.list({
          subscription: sub.id,
          limit: 1,
        });

        if (sessions.data.length > 0) {
          await storage.updateSubscriptionStatus(sessions.data[0].id, sub.status, {
            stripeSubscriptionId: sub.id,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const sessions = await stripe.checkout.sessions.list({
          subscription: sub.id,
          limit: 1,
        });

        if (sessions.data.length > 0) {
          await storage.updateSubscriptionStatus(
            sessions.data[0].id,
            "cancelled",
            {
              cancelledAt: new Date(),
            }
          );
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
