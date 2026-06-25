import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { FREE_ACTION_LIMIT, isEntitled, PAID_PLANS, planForPriceId } from "@/lib/plans";

// Webhook needs the Node runtime (crypto for signature verification) and must
// never be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mirrors the Stripe subscription state into the Organization. Stripe is the
 * source of truth; we derive plan, limit and status from the subscription
 * object. Idempotent: sets absolute state, never increments.
 */
async function syncSubscription(subscription: Stripe.Subscription): Promise<void> {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const org = await prisma.organization.findUnique({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  });
  if (!org) {
    console.warn(`[stripe] Subscription ${subscription.id}: no org for customer ${customerId}`);
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id;
  const plan = planForPriceId(priceId);
  // `plan` truthiness narrows it to a PaidPlan for the PAID_PLANS index below.
  const entitled = isEntitled(subscription.status) && plan !== null;

  await prisma.organization.update({
    where: { id: org.id },
    data: {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      plan: entitled && plan ? "PRO" : "FREE",
      monthlyActionLimit:
        entitled && plan ? PAID_PLANS[plan].monthlyActionLimit : FREE_ACTION_LIMIT,
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // RAW body — Stripe signs the exact text; request.json() would break the check.
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid signature";
    return new Response(`Webhook signature verification failed: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // Links org <-> Stripe customer/subscription. The accompanying
        // customer.subscription.* event sets plan/status.
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.client_reference_id;
        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (organizationId && customerId) {
          await prisma.organization.update({
            where: { id: organizationId },
            data: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId ?? undefined,
            },
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        await prisma.organization.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            plan: "FREE",
            monthlyActionLimit: FREE_ACTION_LIMIT,
            subscriptionStatus: "canceled",
          },
        });
        break;
      }

      default:
        // Other events intentionally ignored (Stripe sends many).
        break;
    }
  } catch (err) {
    console.error(`[stripe] Handling ${event.type} failed:`, err);
    // 500 -> Stripe retries the event later (idempotency makes this safe).
    return new Response("Webhook handler failed", { status: 500 });
  }

  return Response.json({ received: true });
}
