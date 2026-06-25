import { prisma } from "@/lib/db";

/**
 * Fallback monthly action limit, used only if an organization has no explicit
 * monthlyActionLimit (shouldn't happen — the column has a DB default). The real
 * per-plan limit lives on the organization and is maintained by the Stripe
 * webhook.
 *
 * Each "action" here stands for one paid Claude call; this cap is the app-level
 * brake that complements the Anthropic console spend limit.
 */
export const MONTHLY_ACTION_LIMIT = Math.max(
  1,
  Number(process.env.MONTHLY_ACTION_LIMIT) || 10,
);

export interface ActionUsage {
  used: number;
  limit: number;
  remaining: number;
  exceeded: boolean;
  periodStart: Date;
}

/** First moment of the current calendar month (server time, UTC on Vercel). */
function currentPeriodStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/**
 * Reads an organization's quota for the current calendar month.
 *
 * NOTE: This template has no usage table by default, so `used` is 0 — wire it to
 * your own counter once you add the entity an action produces, e.g.:
 *
 *   const used = await prisma.<yourModel>.count({
 *     where: { organizationId, createdAt: { gte: periodStart } },
 *   });
 *
 * Multi-tenancy: always scoped by organizationId.
 */
export async function getActionUsage(organizationId: string): Promise<ActionUsage> {
  const periodStart = currentPeriodStart();
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { monthlyActionLimit: true },
  });

  const used = 0; // TODO: replace with a real count of this month's actions.
  const limit = org?.monthlyActionLimit ?? MONTHLY_ACTION_LIMIT;

  return {
    used,
    limit,
    remaining: Math.max(0, limit - used),
    exceeded: used >= limit,
    periodStart,
  };
}
