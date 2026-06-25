import Link from "next/link";

interface DashboardShellProps {
  orgName: string | null;
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}

/**
 * Dashboard chrome: top nav + sign-out + content container. The sign-out server
 * action is passed in from the layout (where signOut() can run).
 */
export function DashboardShell({
  orgName,
  signOutAction,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="font-semibold">
            {orgName ?? "Dashboard"}
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-sm text-neutral-600 hover:text-black"
            >
              Sign out
            </button>
          </form>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
