import { createFileRoute } from "@tanstack/react-router";
import { AuthShell, SignupForm } from "@/lib/auth-ui";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Ledgerly" }, { name: "description", content: "Create your free Ledgerly account and send your first invoice in minutes." }] }),
  component: () => (
    <AuthShell title="Create your account" subtitle="Free forever for your first 5 invoices a month. No credit card.">
      <SignupForm />
    </AuthShell>
  ),
});
