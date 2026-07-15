import { createFileRoute } from "@tanstack/react-router";
import { AuthShell, LoginForm } from "@/lib/auth-ui";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Ledgerly" }, { name: "description", content: "Log in to Ledgerly to manage your invoices, clients and billing." }] }),
  component: () => (
    <AuthShell title="Welcome back" subtitle="Log in to your Ledgerly account to continue billing.">
      <LoginForm />
    </AuthShell>
  ),
});
