import type { DefaultSession } from "next-auth";

/**
 * Extend Session/JWT with organizationId so every server-side query can be
 * scoped to a tenant (multi-tenancy).
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      organizationId: string;
    } & DefaultSession["user"];
  }

  interface User {
    organizationId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    organizationId: string;
  }
}
