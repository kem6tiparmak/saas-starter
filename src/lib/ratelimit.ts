import { headers } from "next/headers";
import { prisma } from "@/lib/db";

/** Reads the client IP from the request headers. Vercel sets x-forwarded-for. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * DB-backed IP rate limit. Counts hits for an IP in a named bucket within the
 * given window; if under the limit it records a new hit and returns true
 * (allowed). Use on any endpoint that can trigger paid work (login, register,
 * public forms, AI calls).
 *
 * @param bucket   - logical bucket name, e.g. "login" | "register" | "form"
 * @param limit    - max hits allowed in the window
 * @param windowMs - window length in milliseconds
 * @returns true if the request is allowed, false if the limit is exceeded
 */
export async function checkRateLimit(
  bucket: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const ip = await getClientIp();
  const windowStart = new Date(Date.now() - windowMs);

  const hits = await prisma.rateLimitHit.count({
    where: { ip, bucket, createdAt: { gte: windowStart } },
  });
  if (hits >= limit) return false;

  await prisma.rateLimitHit.create({ data: { ip, bucket } });
  return true;
}
