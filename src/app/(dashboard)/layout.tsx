import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard-shell";

/**
 * Route protection lives HERE, not in middleware (bcrypt needs the Node runtime,
 * middleware is Edge). Every route under (dashboard) is gated by this layout.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.organizationId) redirect("/login");

  const org = await prisma.organization.findUnique({
    where: { id: session.user.organizationId },
    select: { name: true },
  });

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <DashboardShell orgName={org?.name ?? null} signOutAction={doSignOut}>
      {children}
    </DashboardShell>
  );
}
