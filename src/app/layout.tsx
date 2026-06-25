import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B2B SaaS Template",
  description: "Multi-tenant SaaS starter: Auth.js, Prisma, Stripe, Claude.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
