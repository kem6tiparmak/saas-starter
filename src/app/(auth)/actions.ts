"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { checkRateLimit } from "@/lib/ratelimit";

const LOGIN_RATE_LIMIT = 20;
const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const REGISTER_RATE_LIMIT = 10;
const REGISTER_RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export interface AuthFormState {
  error?: string;
}

/** Builds a unique org slug from the company name (suffix on collision). */
async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || "org";
  let slug = base;
  for (let i = 0; i < 3; i++) {
    const existing = await prisma.organization.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${base}-${randomBytes(2).toString("hex")}`;
  }
  return `${base}-${randomBytes(4).toString("hex")}`;
}

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const orgName = String(formData.get("orgName") ?? "").trim();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim() || null;
  const honeypot = String(formData.get("_hp") ?? "");

  // Bots fill the hidden field — silently ignore, create no account.
  if (honeypot) return {};

  if (!orgName || orgName.length < 2) return { error: "Company name is required." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Invalid email." };
  if (password.length < 8) return { error: "Password needs at least 8 characters." };

  // IP rate limit against mass registration (each account can trigger paid AI calls).
  const allowed = await checkRateLimit("register", REGISTER_RATE_LIMIT, REGISTER_RATE_WINDOW_MS);
  if (!allowed) return { error: "Too many sign-ups. Please try again later." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "This email is already registered." };

  const passwordHash = await bcrypt.hash(password, 12);
  const slug = await uniqueSlug(orgName);

  // Create org + user + membership (user is OWNER of their new org) in one go.
  await prisma.organization.create({
    data: {
      name: orgName,
      slug,
      memberships: {
        create: {
          role: "OWNER",
          user: { create: { email, name, passwordHash } },
        },
      },
    },
  });

  // signIn triggers a redirect on success (throws NEXT_REDIRECT) — intentionally
  // NOT wrapped in try/catch so the redirect propagates.
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  return {};
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

  const allowed = await checkRateLimit("login", LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MS);
  if (!allowed) return { error: "Too many login attempts. Please wait 15 minutes." };

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
    return {};
  } catch (err) {
    // AuthError -> wrong credentials. NEXT_REDIRECT must be re-thrown.
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    return { error: "Wrong email or password." };
  }
}
