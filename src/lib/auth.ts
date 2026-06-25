import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

/**
 * Auth.js (NextAuth v5) with a Credentials provider (email + password).
 *
 * JWT strategy: Credentials require JWT sessions (DB sessions don't work with
 * Credentials). The active organizationId is carried in the token so every
 * server-side query can be scoped to a tenant.
 *
 * Route protection does NOT run in middleware (bcrypt needs the Node runtime,
 * middleware is Edge) — it runs in the dashboard layout via auth(). See AGENTS.md.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          include: {
            // Pick the first membership as the active organization. Multi-org
            // switching can later set this from a UI selection.
            memberships: { orderBy: { createdAt: "asc" }, take: 1 },
          },
        });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        const organizationId = user.memberships[0]?.organizationId;
        if (!organizationId) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          organizationId,
        };
      },
    }),
  ],
  callbacks: {
    // Auth.js v5 JWT type augmentation is unreliable under tsc, so we cast.
    jwt: ({ token, user }) => {
      if (user) token.organizationId = user.organizationId as string;
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.organizationId = token.organizationId as string;
      }
      return session;
    },
  },
});
