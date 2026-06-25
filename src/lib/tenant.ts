import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Returns the organizationId of the signed-in session, or redirects to /login.
 *
 * MULTI-TENANCY RULE: every business DB query MUST use this organizationId in
 * its where-filter. That way tenant A never sees tenant B's data. Never load an
 * entity by id alone without also checking organizationId.
 */
export async function requireOrg(): Promise<{
  organizationId: string;
  userId: string;
}> {
  const session = await auth();
  if (!session?.user?.organizationId) {
    redirect("/login");
  }
  return {
    organizationId: session.user.organizationId,
    userId: session.user.id as string,
  };
}
