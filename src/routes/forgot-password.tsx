import { createFileRoute } from "@tanstack/react-router";
import { AuthShell, ForgotForm } from "@/lib/auth-ui";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Ledgerly" }, { name: "description", content: "Reset your Ledgerly password by email." }] }),
  component: () => (
    <AuthShell title="Reset your password" subtitle="Enter your email and we'll send you a reset link.">
      <ForgotForm />
    </AuthShell>
  ),
});
