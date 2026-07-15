import type { InvoiceStatus } from "@/lib/demo-data";

const MAP: Record<InvoiceStatus, { label: string; cls: string }> = {
  draft:   { label: "Draft",   cls: "bg-muted text-muted-foreground border-border" },
  sent:    { label: "Sent",    cls: "bg-info/10 text-info border-info/20" },
  paid:    { label: "Paid",    cls: "bg-success/15 text-success border-success/20" },
  overdue: { label: "Overdue", cls: "bg-destructive/10 text-destructive border-destructive/20" },
  partial: { label: "Partial", cls: "bg-warning/15 text-warning-foreground border-warning/30" },
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const m = MAP[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${m.cls}`}>
      {m.label}
    </span>
  );
}
