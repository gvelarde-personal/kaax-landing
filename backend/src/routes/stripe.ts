import { Hono } from "hono";
import { stripe, isProd, isTestMode } from "../lib/stripe";
import { storage } from "../lib/storage";

const app = new Hono();

// POST /stripe/create-checkout - Create Stripe Checkout session
app.post("/create-checkout", async (c) => {
  try {
    const body = await c.req.json();
    const { customerEmail, customerName } = body;

    if (!customerEmail) {
      return c.json({ message: "customerEmail is required" }, 400);
    }

    const priceId = isProd()
      ? process.env.STRIPE_PRICE_ID_PROD
      : process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      console.error("STRIPE_PRICE_ID not configured");
      return c.json({ message: "Payment configuration error" }, 500);
    }

    const frontendUrl = process.env.FRONTEND_URL || "https://kaax.ai";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      metadata: {
        customerName: customerName || "",
      },
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}`,
    });

    return c.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return c.json({ message: error.message || "Failed to create checkout" }, 500);
  }
});

// POST /stripe/webhook - Handle Stripe webhooks
app.post("/webhook", async (c) => {
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature");

  if (!sig) {
    return c.json({ message: "No signature provided" }, 400);
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
    return c.json({ message: `Webhook Error: ${err.message}` }, 400);
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

    return c.json({ received: true });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

export default app;
