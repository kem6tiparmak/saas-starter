import type { Plan } from "@prisma/client";

/**
 * Plan catalog: what a plan costs (Stripe price) and what quota it unlocks.
 * FREE is the default without an active subscription (small backstop limit).
 *
 * Price IDs come from the env (created in the Stripe dashboard) so test and live
 * mode can be configured separately without code changes.
 */
export interface PlanConfig {
  /** Stripe Price ID (recurring, monthly). */
  priceId: string | undefined;
  /** Monthly action quota on this plan (each action may trigger a paid AI call). */
  monthlyActionLimit: number;
  /** Display name in the UI. */
  label: string;
  /** Price text for the UI. */
  priceLabel: string;
}

/** Paid plan(s) with Stripe price and quota. Add more keys as you grow. */
export const PAID_PLANS = {
  PRO: {
    priceId: process.env.STRIPE_PRICE_PRO,
    monthlyActionLimit: 100,
    label: "Pro",
    priceLabel: "49 €/month",
  },
} satisfies Record<"PRO", PlanConfig>;

export type PaidPlan = keyof typeof PAID_PLANS;

/** Default quota for orgs without an active paid subscription. */
export const FREE_ACTION_LIMIT = 10;

/**
 * Stripe statuses that count as "entitled" (full plan access). `trialing` is the
 * free trial, `past_due` is a short grace period while Stripe retries payment.
 */
const ENTITLED_STATUSES = new Set(["trialing", "active", "past_due"]);

export function isEntitled(status: string | null | undefined): boolean {
  return Boolean(status && ENTITLED_STATUSES.has(status));
}

/** Maps a Stripe Price ID back to our internal plan, else null. */
export function planForPriceId(priceId: string | null | undefined): PaidPlan | null {
  if (!priceId) return null;
  for (const plan of Object.keys(PAID_PLANS) as PaidPlan[]) {
    if (PAID_PLANS[plan].priceId === priceId) return plan;
  }
  return null;
}

/** Returns the quota for a plan (FREE falls back to the backstop limit). */
export function actionLimitForPlan(plan: Plan): number {
  if (plan === "PRO") return PAID_PLANS.PRO.monthlyActionLimit;
  return FREE_ACTION_LIMIT;
}
