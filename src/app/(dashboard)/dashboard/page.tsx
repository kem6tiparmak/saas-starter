import { prisma } from "@/lib/db";
import { requireOrg } from "@/lib/tenant";
import { getActionUsage } from "@/lib/quota";
import { isStripeConfigured } from "@/lib/stripe";

/**
 * Example tenant-scoped dashboard page. Note how every read goes through
 * requireOrg() and filters by organizationId — that is the multi-tenancy rule.
 */
export default async function DashboardPage() {
  const { organizationId } = await requireOrg();

  const [org, usage] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { name: true, plan: true, subscriptionStatus: true },
    }),
    getActionUsage(organizationId),
  ]);

  const onPaidPlan = org?.plan === "PRO";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {org?.name}</h1>
        <p className="text-neutral-600">
          This is your tenant-scoped dashboard. Build your product here.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card title="Plan">
          <p className="text-lg font-medium">{org?.plan ?? "FREE"}</p>
          {org?.subscriptionStatus && (
            <p className="text-sm text-neutral-500">
              Status: {org.subscriptionStatus}
            </p>
          )}
        </Card>

        <Card title="Usage this month">
          <p className="text-lg font-medium">
            {usage.used} / {usage.limit}
          </p>
          <p className="text-sm text-neutral-500">{usage.remaining} remaining</p>
        </Card>
      </section>

      {isStripeConfigured() && !onPaidPlan && (
        <form action="/api/stripe/checkout" method="post">
          <button
            type="submit"
            className="rounded-md bg-black px-5 py-2.5 text-white hover:bg-neutral-800"
          >
            Start 30-day trial (Pro)
          </button>
        </form>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="mb-2 text-sm font-medium text-neutral-500">{title}</h2>
      {children}
    </div>
  );
}
