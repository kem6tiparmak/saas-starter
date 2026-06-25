import Stripe from "stripe";

/**
 * Server-side Stripe client (lazy singleton).
 *
 * The key is read from the environment only — never hardcode it, never expose
 * it via NEXT_PUBLIC_*. Works with a restricted key (rk_, least privilege,
 * recommended for production) just as well as a secret key (sk_).
 *
 * The API version is intentionally left at the SDK default (no explicit
 * apiVersion) so the pinned `stripe` package and its TypeScript types stay in
 * sync — pinning a mismatched version is a common source of type errors.
 */
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set — billing features are disabled.",
      );
    }
    client = new Stripe(key);
  }
  return client;
}

/** True if Stripe is configured at all (used to hide billing UI when not). */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
