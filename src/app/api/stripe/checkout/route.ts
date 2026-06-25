import { prisma } from "@/lib/db";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { PAID_PLANS } from "@/lib/plans";
import { requireOrg } from "@/lib/tenant";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Starts a Stripe Checkout session for the PRO subscription with a 30-day trial
 * (card collected upfront). On success Stripe redirects back and fires the
 * webhook, which links the customer to this org and sets the plan.
 *
 * client_reference_id carries the organizationId so the webhook can match the
 * resulting customer to the right tenant.
 */
export async function POST(): Promise<Response> {
  if (!isStripeConfigured()) {
    return new Response("Billing not configured", { status: 503 });
  }

  const { organizationId } = await requireOrg();
  const priceId = PAID_PLANS.PRO.priceId;
  if (!priceId) {
    return new Response("STRIPE_PRICE_PRO not set", { status: 500 });
  }

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { stripeCustomerId: true },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: organizationId,
    customer: org?.stripeCustomerId ?? undefined,
    subscription_data: { trial_period_days: 30 },
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/dashboard?checkout=cancel`,
  });

  if (!session.url) {
    return new Response("Failed to create checkout session", { status: 500 });
  }

  // 303 -> the browser follows with a GET to Stripe's hosted checkout.
  return Response.redirect(session.url, 303);
}
