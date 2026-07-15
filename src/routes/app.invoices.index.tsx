import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { INVOICES, formatMoney, computeTotals, type InvoiceStatus } from "@/lib/demo-data";
import { Plus, Search } from "lucide-react";

export const Route = createFileRoute("/app/invoices/")({
  head: () => ({ meta: [{ title: "Invoices — Ledgerly" }] }),
  component: InvoiceHistory,
});

const FILTERS: (InvoiceStatus | "all")[] = ["all", "draft", "sent", "paid", "overdue", "partial"];

function InvoiceHistory() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const list = useMemo(() => {
    return INVOICES.filter((i) => (filter === "all" || i.status === filter) && (q === "" || i.number.toLowerCase().includes(q.toLowerCase()) || i.clientCompany.toLowerCase().includes(q.toLowerCase())));
  }, [q, filter]);
  return (
    <div className="container-page py-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">Every invoice you've created, sent, or drafted.</p>
        </div>
        <Button asChild size="sm"><Link to="/app/invoices/new"><Plus className="mr-1 h-4 w-4" /> New invoice</Link></Button>
      </div>

      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by invoice number or client" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
            </div>
            <div className="flex flex-wrap gap-1">
              {FILTERS.map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${filter === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2.5 text-left font-medium">Invoice</th>
                  <th className="px-4 py-2.5 text-left font-medium">Client</th>
                  <th className="px-4 py-2.5 text-left font-medium">Issued</th>
                  <th className="px-4 py-2.5 text-left font-medium">Due</th>
                  <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                  <th className="px-4 py-2.5 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No invoices match your filters.</td></tr>
                )}
                {list.map((inv) => (
                  <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-surface-muted/40">
                    <td className="px-4 py-3">
                      <Link to="/app/invoices/$id" params={{ id: inv.id }} className="font-medium hover:text-primary">{inv.number}</Link>
                    </td>
                    <td className="px-4 py-3">
                      <div>{inv.clientCompany}</div>
                      <div className="text-xs text-muted-foreground">{inv.clientName}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(inv.issueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatMoney(computeTotals(inv.items).total, inv.currency)}</td>
                    <td className="px-4 py-3 text-right"><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
