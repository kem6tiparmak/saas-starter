import * as Sentry from "@sentry/nextjs";

/**
 * Next.js instrumentation hook. Loads the right Sentry config per runtime.
 * See node_modules/next/dist/docs for the current instrumentation contract.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
