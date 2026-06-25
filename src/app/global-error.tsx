"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Root error boundary (replaces the whole layout, so it renders its own
 * <html>/<body>).
 *
 * IMPORTANT (this Next.js version): the retry prop is `unstable_retry`, NOT
 * `reset`. See AGENTS.md.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <button
            onClick={() => unstable_retry()}
            className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
