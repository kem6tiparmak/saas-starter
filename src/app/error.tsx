"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Route-segment error boundary.
 *
 * IMPORTANT (this Next.js version): the retry prop is `unstable_retry`, NOT
 * `reset`. Using `reset` silently gives you a no-op button. See AGENTS.md.
 */
export default function Error({
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
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-neutral-600">
        An unexpected error occurred. You can try again.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="rounded-md bg-black px-4 py-2 text-white hover:bg-neutral-800"
      >
        Try again
      </button>
    </main>
  );
}
