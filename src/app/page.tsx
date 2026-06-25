import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
      <h1 className="text-4xl font-bold">B2B SaaS Template</h1>
      <p className="text-lg text-neutral-600">
        Multi-tenant starter with Auth.js, Prisma, Stripe billing, Nodemailer,
        Sentry and a server-side Claude layer. Replace this page with your
        product&apos;s landing page.
      </p>
      <div className="flex gap-4">
        <Link
          href="/register"
          className="rounded-md bg-black px-5 py-2.5 text-white hover:bg-neutral-800"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-neutral-300 px-5 py-2.5 hover:bg-neutral-50"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
